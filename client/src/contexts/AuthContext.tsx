import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import {
  resetPasswordForEmail,
  sanitizeRedirectPath,
  signInWithPassword,
  signOutUser,
  signUpWithPassword,
} from "../lib/auth";
import { getOrganizationByOwnerId, type Organization } from "../lib/organization";
import { supabase } from "../lib/supabase";

export type AuthActionResult<T = void> = {
  data: T | null;
  error: string | null;
};

type SignInInput = {
  email: string;
  password: string;
  redirectTo?: string | null;
};

type SignUpInput = {
  email: string;
  password: string;
};

type SignInResult = {
  user: User;
  org: Organization | null;
};

type SignUpResult = {
  requiresEmailConfirmation: boolean;
  user: User | null;
  org: Organization | null;
};

type AuthContextValue = {
  user: User | null;
  org: Organization | null;
  loading: boolean;
  signIn: (input: SignInInput) => Promise<AuthActionResult<SignInResult>>;
  signUp: (input: SignUpInput) => Promise<AuthActionResult<SignUpResult>>;
  signOut: () => Promise<AuthActionResult>;
  resetPassword: (email: string) => Promise<AuthActionResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const syncVersionRef = useRef(0);

  const syncAuthState = useCallback(async (session: Session | null) => {
    const requestId = ++syncVersionRef.current;

    if (!session?.user) {
      if (requestId === syncVersionRef.current) {
        setUser(null);
        setOrg(null);
        setLoading(false);
      }

      return { user: null, org: null, error: null } as const;
    }

    try {
      const nextOrg = await getOrganizationByOwnerId(session.user.id);

      if (requestId === syncVersionRef.current) {
        setUser(session.user);
        setOrg(nextOrg);
        setLoading(false);
      }

      return { user: session.user, org: nextOrg, error: null } as const;
    } catch (error) {
      const message = getErrorMessage(error, "We couldn't load your organization.");

      if (requestId === syncVersionRef.current) {
        setUser(session.user);
        setOrg(null);
        setLoading(false);
      }

      return { user: session.user, org: null, error: message } as const;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!active) {
          return;
        }

        if (error) {
          setUser(null);
          setOrg(null);
          setLoading(false);
          return;
        }

        await syncAuthState(data.session);
      } catch {
        if (active) {
          setUser(null);
          setOrg(null);
          setLoading(false);
        }
      }
    }

    void bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAuthState(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [syncAuthState]);

  const signIn = useCallback(
    async ({ email, password, redirectTo }: SignInInput) => {
      try {
        const { data, error } = await signInWithPassword(email, password);

        if (error) {
          return { data: null, error: error.message };
        }

        if (!data.session?.user) {
          return {
            data: null,
            error: "We couldn't start your session.",
          };
        }

        setLoading(true);
        const nextState = await syncAuthState(data.session);

        if (nextState.error) {
          return { data: null, error: nextState.error };
        }

        if (!nextState.user) {
          return {
            data: null,
            error: "We couldn't load your user profile.",
          };
        }

        const safeRedirect = sanitizeRedirectPath(redirectTo);

        if (!nextState.org) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate(safeRedirect || "/dashboard", { replace: true });
        }

        return {
          data: {
            user: nextState.user,
            org: nextState.org,
          },
          error: null,
        };
      } catch (error) {
        setLoading(false);
        return {
          data: null,
          error: getErrorMessage(error, "Authentication failed."),
        };
      }
    },
    [navigate, syncAuthState],
  );

  const signUp = useCallback(
    async ({ email, password }: SignUpInput) => {
      try {
        const { data, error } = await signUpWithPassword(email, password);

        if (error) {
          return { data: null, error: error.message };
        }

        if (!data.session?.user) {
          return {
            data: {
              requiresEmailConfirmation: true,
              user: data.user,
              org: null,
            },
            error: null,
          };
        }

        setLoading(true);
        const nextState = await syncAuthState(data.session);

        if (nextState.error) {
          return { data: null, error: nextState.error };
        }

        if (!nextState.org) {
          navigate("/onboarding", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }

        return {
          data: {
            requiresEmailConfirmation: false,
            user: nextState.user,
            org: nextState.org,
          },
          error: null,
        };
      } catch (error) {
        setLoading(false);
        return {
          data: null,
          error: getErrorMessage(error, "We couldn't create your account."),
        };
      }
    },
    [navigate, syncAuthState],
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await signOutUser();

      if (error) {
        return { data: null, error: error.message };
      }

      ++syncVersionRef.current;
      setUser(null);
      setOrg(null);
      setLoading(false);
      navigate("/login", { replace: true });

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: getErrorMessage(error, "We couldn't sign you out."),
      };
    }
  }, [navigate]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await resetPasswordForEmail(email);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: getErrorMessage(error, "We couldn't send the reset link."),
      };
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      org,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [loading, org, resetPassword, signIn, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
