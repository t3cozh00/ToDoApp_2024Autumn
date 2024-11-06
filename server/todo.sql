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

-- insert test users
insert into account (email, password) values ('test11@foo.com', 'passwordtest11123');
insert into account (email, password) values ('test22@foo.com', 'passwordtest22123');

-- insert test tasks for test users
insert into task (description, user_id, user_email) values ('My test task', 1, 'test11@foo.com');
insert into task (description, user_id, user_email) values ('My another test task', 2, 'test22@foo.com');



