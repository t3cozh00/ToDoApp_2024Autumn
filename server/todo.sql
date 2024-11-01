drop table if exists task;
drop table if exists account;

create table account (
    id serial primary key,
    email varchar(50) unique not null,
    password varchar(255) not null
);

create table task (
    id serial primary key,
    description varchar(255) not null,
    user_id integer references account(id),
    user_email varchar(50) 
);

insert into task (description) values ('My test task');
insert into task (description) values ('My another test task');


