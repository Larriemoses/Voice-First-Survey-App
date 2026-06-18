-- Run this migration once in the Supabase SQL editor (or through the CLI).
-- It restores the authenticated workspace access expected by the web client.

alter table public.organizations enable row level security;

drop policy if exists "Owners can view their organization" on public.organizations;
create policy "Owners can view their organization"
  on public.organizations for select to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Users can create their organization" on public.organizations;
create policy "Users can create their organization"
  on public.organizations for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Owners can update their organization" on public.organizations;
create policy "Owners can update their organization"
  on public.organizations for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Owners can view workspace surveys" on public.surveys;
create policy "Owners can view workspace surveys"
  on public.surveys for select to authenticated
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = surveys.organization_id
        and organizations.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can create workspace surveys" on public.surveys;
create policy "Owners can create workspace surveys"
  on public.surveys for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.organizations
      where organizations.id = surveys.organization_id
        and organizations.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can update workspace surveys" on public.surveys;
create policy "Owners can update workspace surveys"
  on public.surveys for update to authenticated
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = surveys.organization_id
        and organizations.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can delete workspace surveys" on public.surveys;
create policy "Owners can delete workspace surveys"
  on public.surveys for delete to authenticated
  using (
    exists (
      select 1 from public.organizations
      where organizations.id = surveys.organization_id
        and organizations.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can manage survey questions" on public.questions;
create policy "Owners can manage survey questions"
  on public.questions for all to authenticated
  using (
    exists (
      select 1 from public.surveys
      join public.organizations on organizations.id = surveys.organization_id
      where surveys.id = questions.survey_id
        and organizations.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.surveys
      join public.organizations on organizations.id = surveys.organization_id
      where surveys.id = questions.survey_id
        and organizations.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can view survey respondents" on public.respondents;
create policy "Owners can view survey respondents"
  on public.respondents for select to authenticated
  using (
    exists (
      select 1 from public.surveys
      join public.organizations on organizations.id = surveys.organization_id
      where surveys.id = respondents.survey_id
        and organizations.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can view survey responses" on public.responses;
create policy "Owners can view survey responses"
  on public.responses for select to authenticated
  using (
    exists (
      select 1 from public.surveys
      join public.organizations on organizations.id = surveys.organization_id
      where surveys.id = responses.survey_id
        and organizations.owner_id = auth.uid()
    )
  );
