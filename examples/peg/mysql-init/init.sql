ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'granite-numeric-canopener';
CREATE USER 'web'@'%' IDENTIFIED WITH mysql_native_password BY 'stingray-coleslaw-overbill';

FLUSH PRIVILEGES;
