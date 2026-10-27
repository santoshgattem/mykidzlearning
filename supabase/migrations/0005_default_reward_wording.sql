-- New children start with the first reward worded as a rate: ₹100 for every 1,000 points.
-- Only the default text for children added from now on changes. Existing children keep their
-- rewards; a parent can edit the wording on the Rewards tab.
create or replace function public.seed_default_milestones() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.milestones (student_id, points, reward, tier) values
    (new.id,   1000, '₹100 pocket money for every 1,000 pts', 'bronze'),
    (new.id,  10000, 'Gift of your choice (up to ₹1,000)',    'silver'),
    (new.id,  50000, 'Wireless headphones',                   'gold'),
    (new.id, 100000, 'New mobile phone',                      'diamond');
  return new;
end $$;
