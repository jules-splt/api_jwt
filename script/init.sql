create table users(
   id serial primary key,
   email varchar(50) unique not null,
   pass varchar(255)
)
create table Articles
(
   id varchar(70) primary key ,
   auteur varchar(150),
   titre varchar(150),
   contenue text,
   datePubli date
)