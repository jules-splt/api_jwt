create table users(
   id serial primary key,
   email varchar(50) unique not null,
   pass varchar(255)
)