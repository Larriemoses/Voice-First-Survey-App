-- Authenticated workspace access for the production membership schema.
-- Production uses organizations.owner_user_id plus organization_members.user_id.

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.surveys enable row level security;
alter table public.questions enable row level security;
alter table public.respondents enable row level security;
alter table public.responses enable row level security;

drop policy if exists "Users can view their memberships" on public.organization_members;
create policy "Users can view their memberships"
  on public.organization_members for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Owners can create memberships" on public.organization_members;
create policy "Owners can create memberships"
  on public.organization_members for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.organizations
      where organizations.id = organization_members.organization_id
        and organizations.owner_user_id = auth.uid()
    )
  );

drop policy if exists "Members can view organizations" on public.organizations;
create policy "Members can view organizations"
  on public.organizations for select to authenticated
  using (
    owner_user_id = auth.uid()
    or exists (
      select 1 from public.organization_members
      where organization_members.organization_id = organizations.id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations"
  on public.organizations for insert to authenticated
  with check (owner_user_id = auth.uid());

drop policy if exists "Owners can update organizations" on public.organizations;
create policy "Owners can update organizations"
  on public.organizations for update to authenticated
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

drop policy if exists "Members can view workspace surveys" on public.surveys;
create policy "Members can view workspace surveys"
  on public.surveys for select to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = surveys.organization_id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can create workspace surveys" on public.surveys;
create policy "Members can create workspace surveys"
  on public.surveys for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.organization_members
      where organization_members.organization_id = surveys.organization_id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can update workspace surveys" on public.surveys;
create policy "Members can update workspace surveys"
  on public.surveys for update to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = surveys.organization_id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can delete workspace surveys" on public.surveys;
create policy "Members can delete workspace surveys"
  on public.surveys for delete to authenticated
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = surveys.organization_id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can manage survey questions" on public.questions;
create policy "Members can manage survey questions"
  on public.questions for all to authenticated
  using (
    exists (
      select 1 from public.surveys
      join public.organization_members
        on organization_members.organization_id = surveys.organization_id
      where surveys.id = questions.survey_id
        and organization_members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.surveys
      join public.organization_members
        on organization_members.organization_id = surveys.organization_id
      where surveys.id = questions.survey_id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can view survey respondents" on public.respondents;
create policy "Members can view survey respondents"
  on public.respondents for select to authenticated
  using (
    exists (
      select 1 from public.surveys
      join public.organization_members
        on organization_members.organization_id = surveys.organization_id
      where surveys.id = respondents.survey_id
        and organization_members.user_id = auth.uid()
    )
  );

drop policy if exists "Members can view survey responses" on public.responses;
create policy "Members can view survey responses"
  on public.responses for select to authenticated
  using (
    exists (
      select 1 from public.surveys
      join public.organization_members
        on organization_members.organization_id = surveys.organization_id
      where surveys.id = responses.survey_id
        and organization_members.user_id = auth.uid()
    )
  );
