alter table public.surveys enable row level security;
alter table public.questions enable row level security;
alter table public.respondents enable row level security;
alter table public.responses enable row level security;

drop policy if exists "Published surveys are public" on public.surveys;
create policy "Published surveys are public"
  on public.surveys
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Published survey questions are public" on public.questions;
create policy "Published survey questions are public"
  on public.questions
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.surveys
      where surveys.id = questions.survey_id
        and surveys.status = 'published'
    )
  );

drop policy if exists "Published survey respondents can be created" on public.respondents;
create policy "Published survey respondents can be created"
  on public.respondents
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.surveys
      where surveys.id = respondents.survey_id
        and surveys.status = 'published'
    )
  );

drop policy if exists "Published survey responses can be inserted" on public.responses;
create policy "Published survey responses can be inserted"
  on public.responses
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.respondents
      join public.surveys on surveys.id = respondents.survey_id
      where respondents.id = responses.respondent_id
        and surveys.status = 'published'
        and responses.survey_id = surveys.id
    )
  );

drop policy if exists "Published survey responses can be updated" on public.responses;
create policy "Published survey responses can be updated"
  on public.responses
  for update
  to anon, authenticated
  using (
    exists (
      select 1
      from public.respondents
      join public.surveys on surveys.id = respondents.survey_id
      where respondents.id = responses.respondent_id
        and surveys.status = 'published'
        and responses.survey_id = surveys.id
    )
  )
  with check (
    exists (
      select 1
      from public.respondents
      join public.surveys on surveys.id = respondents.survey_id
      where respondents.id = responses.respondent_id
        and surveys.status = 'published'
        and responses.survey_id = surveys.id
    )
  );
