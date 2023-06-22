--cabin information
create or replace view cabin_info as
select A."Cabin Number", "Capacity", "Current Animal Count", "Free Space", "Cabin Type", "Type of Animal", B.Animals
from
(
        select CABIN_NO as "Cabin Number", CABIN_SIZE as "Capacity", EXISTING_QUANTITY as "Current Animal Count", CAPACITY as "Free Space",
           TYPE as "Cabin Type", ANIMAL_TYPE as "Type of Animal"
        from CABIN
) A join
(
    select CABIN_NO as "Cabin Number", listagg(Animals, ', ') as Animals
    from (
        select CABIN.CABIN_NO, 'd_'||listagg(DAYCARE_ANIMAL_ID, ', d_') as Animals
    from CABIN join DAYCARE_ANIMAL DA on CABIN.CABIN_NO = DA.CABIN_NO
    group by CABIN.CABIN_NO
    union
    select CABIN.CABIN_NO, 'r_'||listagg(RESCUED_ANIMAL_ID, ', r_') as Animals
    from CABIN join RESCUED_ANIMAL RA on CABIN.CABIN_NO = RA.CABIN_NO
    group by CABIN.CABIN_NO
         )
    group by CABIN_NO
    order by CABIN_NO
) B on A."Cabin Number"=B."Cabin Number"(+)
order by A."Cabin Number";


--animal vet history
create or replace view daycare_animal_history as
select daycare_animal_id as "Daycare Animal ID", VETERINARIAN.VET_ID as "Veterinarian ID", initcap(name) "Veterinarian Name", to_char(care_date, 'dd-mm-yyyy') as "Checkup Date"
from VETERINARIAN join CHECKUP_DAYCARE on VETERINARIAN.VET_ID = CHECKUP_DAYCARE.VET_ID(+)
order by DAYCARE_ANIMAL_ID;

create or replace view rescued_animal_history as
select RESCUED_ANIMAL_ID as "Rescued Animal ID", V.VET_ID as "Veterinarian ID", initcap(name) "Veterinarian Name", to_char(care_date, 'dd-mm-yyyy') as "Checkup Date"
from VETERINARIAN V join CHECKUP_RESCUE CR on V.VET_ID = CR.VET_ID(+)
order by RESCUED_ANIMAL_ID;


--customer donation
create or replace view customer_donation as
select CUSTOMER.CUSTOMER_ID as "Customer ID", initcap(CUSTOMER.NAME) "Customer Name", CUSTOMER.EMAIL, CUSTOMER.ADDRESS.house || ', ' || CUSTOMER.ADDRESS.street || ', ' || CUSTOMER.ADDRESS.city as Address,
       sum(AMOUNT) as "Donation Amount", listagg(to_char(DONATION_DATE, 'dd-mm-yyyy'), ', ') as "Donation Date"
from CUSTOMER join DONATION on CUSTOMER.CUSTOMER_ID = DONATION.CUSTOMER_ID
group by CUSTOMER.CUSTOMER_ID, CUSTOMER.NAME, CUSTOMER.EMAIL, CUSTOMER.ADDRESS.house || ', ' ||CUSTOMER.ADDRESS.street || ', ' ||CUSTOMER.ADDRESS.city
order by CUSTOMER.CUSTOMER_ID;


--non customer donation
create or replace view non_customer_donation as
select DONATION_NO, initcap(NAME) as Name, sum(AMOUNT) as "Donation Amount", listagg(to_char(DONATION_DATE, 'dd-mm-yyyy'), ', ') as "Donation Date"
from DONATION
where CUSTOMER_ID is NULL
group by DONATION_NO, initcap(NAME)
order by DONATION_NO;


--feedbacks
create or replace view feedback_view as
select initcap(C.NAME) as "Customer Name", C.EMAIL as "Customer Email", F.FEEDBACK_SUBJECT as "Feedback Subject",
       to_char(F.F_DATE, 'dd-mm-yyyy') as "Feedback Time", F.RATING, F.MESSAGE as "Feedback Body"
from CUSTOMER C join FEEDBACK F on C.CUSTOMER_ID(+) = F.CUSTOMER_ID
order by C.CUSTOMER_ID;

create or replace view positive_feedback as
select name,rating,message from customer,feedback
where customer.customer_id=feedback.customer_id
and rating >3.5;

create or replace view negative_feedback as
select name,rating,message from customer,feedback
where customer.customer_id=feedback.customer_id
and rating <3.5;


--healthy animal
create or replace view healthy_daycare_animal as
select DAYCARE_ANIMAL_ID,breed,type,to_char(COMING_DATE,'dd-mm-yyyy') AS "coming date",to_char(RELEASE_DATE,'dd-mm-yyyy') as "release date",CABIN_NO,CUSTOMER_ID
from DAYCARE_ANIMAL
where CABIN_NO in (
    select CABIN_NO from CABIN where upper(CABIN.TYPE)='HEALTHY'
    )
order by DAYCARE_ANIMAL_ID;

create or replace view healthy_rescued_animal as
select *
from RESCUED_ANIMAL
where CABIN_NO in (
    select CABIN_NO from CABIN where upper(CABIN.TYPE)='HEALTHY'
    )
order by RESCUED_ANIMAL_ID;

select * from HEALTHY_DAYCARE_ANIMAL;


--unvaccinated animals
create or replace view unvaccinated_daycare_animal as
select *
from DAYCARE_ANIMAL
where CABIN_NO in (
    select CABIN_NO from CABIN where upper(CABIN.TYPE)='UNVACCINATED'
    )
order by DAYCARE_ANIMAL_ID;

create or replace view unvaccinated_rescued_animal as
select *
from RESCUED_ANIMAL
where CABIN_NO in (
    select CABIN_NO from CABIN where upper(CABIN.TYPE)='UNVACCINATED'
    )
order by RESCUED_ANIMAL_ID;


--isolated animals
create or replace view isolated_daycare_animal as
select *
from DAYCARE_ANIMAL
where CABIN_NO in (
    select CABIN_NO from CABIN where upper(CABIN.TYPE)='ISOLATED'
    )
order by DAYCARE_ANIMAL_ID;

create or replace view isolated_rescued_animal as
select *
from RESCUED_ANIMAL
where CABIN_NO in (
    select CABIN_NO from CABIN where upper(CABIN.TYPE)='ISOLATED'
    )
order by RESCUED_ANIMAL_ID;


--rescuer-rescued animal-cabin
create or replace view rescuer_animal_cabin as
select initcap(R.NAME) as "Rescuer Name", to_char(RS.RESCUE_DATE, 'dd-mm-yyyy') "Rescue Date", RA.RESCUED_ANIMAL_ID "Rescued Animal ID", C2.CABIN_NO
from RESCUER R join RESCUES RS on R.RESCUER_ID = RS.RESCUER_ID join RESCUED_ANIMAL RA on RS.RESCUED_ANIMAL_ID = RA.RESCUED_ANIMAL_ID
    join CABIN C2 on RA.CABIN_NO = C2.CABIN_NO;

--customer-daycare animal-cabin
create or replace view customer_animal_cabin as
select C.CUSTOMER_ID , initcap(C.NAME) as "Customer Name", to_char(COMING_DATE, 'dd-mm-yyyy') ||' to '||to_char(RELEASE_DATE, 'dd-mm-yyyy') as "Duration", DAYCARE_ANIMAL_ID "Daycare Animal ID", C2.CABIN_NO
from CUSTOMER C join DAYCARE_ANIMAL DA on C.CUSTOMER_ID = DA.CUSTOMER_ID join CABIN C2 on DA.CABIN_NO = C2.CABIN_NO
order by C.CUSTOMER_ID;

--rescue information
create or replace view rescue_info  as
select rescuer_id,name as rescuer_name,rescued_animal_id,type as "animal type",
age as "animal age" ,breed as "animal breed",to_char(rescue_date, 'dd-mm-yyyy') as "rescue_date"
from RESCUER natural join RESCUES natural join RESCUED_ANIMAL
order by rescuer_id;



--doctor-shift
create or replace view doctor_shift as
    select vet_id,name, listagg(day||': '||  shift_name || ' shift' ,';  ') "Duty"
from veterinarian natural join works_at
group by vet_id,name
order by vet_id;

--staff specialization
create or replace view staff_specialization as
select specialization "animal_type",listagg('ID '||staff_id||'->Name: '||name, ', ') as specialized_staff
from staff
group by specialization
order by specialization;

--feedback categorization
create or replace view staff_review as
select message "Staff Review" from feedback where feedback_subject='staff';

create or replace view admin_review as
select message "Admin Review" from feedback where feedback_subject='Admin';

create or replace view manager_review as
select message "Manager Review" from feedback where feedback_subject='manager';

create or replace view service_review as
select message "Service Review" from feedback where feedback_subject='overall service';

create or replace view veterinarian_review as
select message "Veterinarian Review" from feedback where feedback_subject='veterinarian';


--average rating
create or replace view average_rating as
select feedback_subject,trunc(avg(rating),1) "Average Rating" from feedback
group by feedback_subject
order by feedback_subject;

--customer total daycare services
create or replace view total_daycare_services  as
SELECT c.customer_id, c.name, COUNT(da.daycare_animal_id) AS total_daycare_services
FROM customer c
left JOIN daycare_animal da ON c.customer_id = da.customer_id
GROUP BY c.customer_id, c.name
order by c.customer_id;

--customer price

create or replace view CUSTOMER_Pricing  as
SELECT c.customer_id, c.name, SUM((da.release_date - da.coming_date) * da.rate) AS total_price
FROM customer c
JOIN daycare_animal da ON c.customer_id = da.customer_id
GROUP BY c.customer_id, c.name;

--vet-Animal
create or replace view vet_animal  as
WITH rescue_animals AS (
    SELECT d.vet_id, d.name, LISTAGG(cr.rescued_animal_id, ', ') WITHIN GROUP (ORDER BY cr.rescued_animal_id) AS treated_rescue_animals
    FROM VETERINARIAN d
    LEFT JOIN checkup_rescue cr ON d.vet_id = cr.vet_id
    GROUP BY d.vet_id, d.name
),
daycare_animals AS (
    SELECT d.vet_id, d.name, LISTAGG(dc.daycare_animal_id, ', ') WITHIN GROUP (ORDER BY dc.daycare_animal_id) AS treated_daycare_animals
    FROM VETERINARIAN d
    LEFT JOIN CHECKUP_DAYCARE dc ON d.vet_id = dc.vet_id
    GROUP BY d.vet_id, d.name
)
SELECT r.vet_id, r.name, r.treated_rescue_animals, d.treated_daycare_animals
FROM rescue_animals r
LEFT JOIN daycare_animals d ON r.vet_id = d.vet_id;


--customer as well as Rescuer
SELECT c.customer_id, cph.phone_no, r.rescuer_id
FROM customer c,customer_phone  cph
, rescuer_phone  rph,
 rescuer r where cph.phone_no = rph.phone_no and c.name=r.name;

create or replace view donation_view as
    select DONATION_NO, name, amount, to_char(donation_date, 'dd-mm-yyyy') as "Date", customer_id
from DONATION
order by DONATION_NO;


--shift_view
create or replace view shift_view as
    select shift.shift_name,to_char(start_time,'hh24:mi:ss') "start_time",to_char(end_time,'hh24:mi:ss') "end_time" from SHIFT
order by shift.shift_name;


--daycare animal health
create or replace view daycare_animal_record_view as
    with temp_record_table as (
        select DA.DAYCARE_ANIMAL_ID, DA.AGE, DA.BREED, DA.WEIGHT, DA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        from DAYCARE_ANIMAL DA join HEALTH_RECORD HR on DA.HEALTH_RECORD_ID = HR.RECORD_ID
        group by DA.DAYCARE_ANIMAL_ID, DA.AGE, DA.BREED, DA.WEIGHT, DA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        order by DAYCARE_ANIMAL_ID
    )
select DAYCARE_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES,  to_char(RABIES_DATE,'dd-mm-yyyy') as  "rabies_date", flu, to_char(FLU_DATE,'dd-mm-yyyy') as "flu_date", SPAY_NEUTER, listagg(DISEASE_NAME, ', ') as "Diseases"
from temp_record_table t join DISEASES D on t.HEALTH_RECORD_ID=D.HEALTH_RECORD_ID(+)
group by DAYCARE_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, RABIES_DATE, flu, FLU_DATE, SPAY_NEUTER
order by DAYCARE_ANIMAL_ID;

select * from DAYCARE_ANIMAL_RECORD_VIEW;

--rescued animal health
create or replace view rescued_animal_record_view as
    with temp_record_table as (
        select RA.RESCUED_ANIMAL_ID, RA.AGE, RA.BREED, RA.WEIGHT, RA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        from RESCUED_ANIMAL RA join HEALTH_RECORD HR on RA.HEALTH_RECORD_ID = HR.RECORD_ID
        group by RA.RESCUED_ANIMAL_ID, RA.AGE, RA.BREED, RA.WEIGHT, RA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        order by RESCUED_ANIMAL_ID
    )
select RESCUED_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, RABIES_DATE, flu, FLU_DATE, SPAY_NEUTER, listagg(DISEASE_NAME, ', ') as "Diseases"
from temp_record_table t join DISEASES D on t.HEALTH_RECORD_ID=D.HEALTH_RECORD_ID(+)
group by RESCUED_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, RABIES_DATE, flu, FLU_DATE, SPAY_NEUTER
order by RESCUED_ANIMAL_ID;

--daycare animal health
create or replace view daycare_animal_record_view as
    with temp_record_table as (
        select DA.DAYCARE_ANIMAL_ID, DA.AGE, DA.BREED, DA.WEIGHT, DA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        from DAYCARE_ANIMAL DA join HEALTH_RECORD HR on DA.HEALTH_RECORD_ID = HR.RECORD_ID
        group by DA.DAYCARE_ANIMAL_ID, DA.AGE, DA.BREED, DA.WEIGHT, DA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        order by DAYCARE_ANIMAL_ID
    )
select DAYCARE_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, to_char(RABIES_DATE,'dd-mm-yyyy') as "Rabies Date", flu, to_char(FLU_DATE,'dd-mm-yyyy')  as "Flu Date", SPAY_NEUTER, listagg(DISEASE_NAME, ', ') as "Diseases"
from temp_record_table t join DISEASES D on t.HEALTH_RECORD_ID=D.HEALTH_RECORD_ID(+)
group by DAYCARE_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, RABIES_DATE, flu, FLU_DATE, SPAY_NEUTER
order by DAYCARE_ANIMAL_ID;

select * from DAYCARE_ANIMAL_RECORD_VIEW;

--rescued animal health
create or replace view rescued_animal_record_view as
    with temp_record_table as (
        select RA.RESCUED_ANIMAL_ID, RA.AGE, RA.BREED, RA.WEIGHT, RA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        from RESCUED_ANIMAL RA join HEALTH_RECORD HR on RA.HEALTH_RECORD_ID = HR.RECORD_ID
        group by RA.RESCUED_ANIMAL_ID, RA.AGE, RA.BREED, RA.WEIGHT, RA.TYPE, HR.RABIES, HR.RABIES_DATE, HR.FLU, HR.FLU_DATE, HR.SPAY_NEUTER, HEALTH_RECORD_ID
        order by RESCUED_ANIMAL_ID
    )
select RESCUED_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, RABIES_DATE, flu, FLU_DATE, SPAY_NEUTER, listagg(DISEASE_NAME, ', ') as "Diseases"
from temp_record_table t join DISEASES D on t.HEALTH_RECORD_ID=D.HEALTH_RECORD_ID(+)
group by RESCUED_ANIMAL_ID, AGE, BREED, WEIGHT, TYPE, RABIES, RABIES_DATE, flu, FLU_DATE, SPAY_NEUTER
order by RESCUED_ANIMAL_ID;

select * from RESCUED_ANIMAL_RECORD_VIEW;