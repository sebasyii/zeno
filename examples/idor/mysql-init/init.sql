ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'granite-numeric-canopener';
CREATE USER 'web'@'%' IDENTIFIED WITH mysql_native_password BY 'stingray-coleslaw-overbill';

USE zeno;

CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

GRANT SELECT, INSERT ON zeno.users TO 'web'@'%';
FLUSH PRIVILEGES;
