# Yoga App !

## Start the application
<h3>Step 1 - Prerequistes</h3>
<p>Make sure the following softs are installed</p>
<ul>
    <li>Java JDK 11 : <a href="https://jdk.java.net/archive/">download here</a></li>
    <li>Maven: <a href="https://maven.apache.org/download.cgi">download here</a></li>
    <li>MySQL >= 8 : <a href="https://dev.mysql.com/downloads/installer/">download here</a></li>
    <li>A MySQL GUI Tool (optionnal) : <a href="https://dev.mysql.com/downloads/workbench/">download here</a></li>
</ul>

<h3>Step 2 - Database creation</h3>
<ul>
    <li>Start MySQL</li>
    <li>Start your MySQL GUI tool and connect to your MySQL</li>
    <li>Create the BDD by importing the SQL script located in ./resources/sql/script.sql</li>
</ul>

<h3>Step 5 - Start the API</h3>
Once everything running fine you can start the Spring boot app.<br>
Go to the root of the project and run `mvn spring-boot:run`

## Run tests
use jdk v11

For launch and generate the jacoco code coverage:
> mvn clean test

find code coverage here : `./target/site/jacoco/index.html`
