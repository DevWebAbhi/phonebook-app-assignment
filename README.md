# phonebook-app-assignment

Phonebook Admin Manager is a web application designed to efficiently manage contacts and their availability. Users can create, update, search, and delete contacts, and assign specific time ranges. 

### Presentation Video Link



## Technoligies Used
--------------------

* Frontend: React.js (deployed on Vercel)
* Backend: Node.js with Express.js (deployed on Render)
* Database: MySQL (hosted on Aiven)
* State Management: Redux for managing contact and availability data
* HTTP Client: Axios for handling API requests
* Date Selection: Date picker for selecting availability dates
* UI Framework: Chakra UI for a clean and accessible component library
* Notifications: Toast messages for success/error feedback


## Database Dump
------------

A database dump is available at: https://drive.google.com/drive/folders/11v7oFHAiYhRFF9SL7PY1rVAMlIw1Xk4-?usp=sharing

Note: The dump does not include stored procedures, as they are not exported by Aiven (DB deployment platform).

## Deployed Link
-----------------

* The deployed link is: https://phonebook-app-assignment.vercel.app

* Backend deployed Link: https://phonebook-app-assignment.onrender.com

## API Endpoints
----------------

### Get All Contacts

* URL: `https://phonebook-app-assignment.onrender.com/contact`
* Method: GET

#### Stored Procedure
---------------------

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "ListContacts"()
BEGIN
    SELECT 
        c.id,
        c.name,  
        c.phone,
        IFNULL(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'day', a.day,
                    'date', a.date,
                    'start_time', a.start_time,
                    'end_time', a.end_time,
                    'unavailable_start', a.unavailable_start,
                    'unavailable_end', a.unavailable_end
                )
            ), JSON_ARRAY()) AS availability
    FROM 
        contacts c
    LEFT JOIN 
        contact_time_availability a
    ON 
        c.id = a.contact_id
    GROUP BY 
        c.id, c.name, c.phone;
END
```

### Get Searched Contacts

* URL: `https://phonebook-app-assignment.onrender.com/contact/search?search=(text)`
* Method: GET
* Query: search

#### Stored Procedure
---------------------

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "SearchContacts"(
    IN search_term VARCHAR(100)
)
BEGIN
    SELECT 
        c.id,
        c.name,  
        c.phone,
        IFNULL(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'day', a.day,
                    'date', a.date,
                    'start_time', a.start_time,
                    'end_time', a.end_time,
                    'unavailable_start', a.unavailable_start,
                    'unavailable_end', a.unavailable_end
                )
            ), JSON_ARRAY()) AS availability
    FROM 
        contacts c
    LEFT JOIN 
        contact_time_availability a
    ON 
        c.id = a.contact_id
    WHERE 
        c.name LIKE CONCAT('%', search_term, '%')
    GROUP BY 
        c.id, c.name, c.phone;
END
```

### Create Contact

* URL: `https://phonebook-app-assignment.onrender.com/contact/create`
* Method: POST
* Body: `name`,`contact`

#### Stored Procedure
---------------------
```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "AddContact"(IN contact_name VARCHAR(100), IN contact_phone VARCHAR(15))
BEGIN
    INSERT INTO contacts (name, phone) VALUES (contact_name, contact_phone);
END
```

### Update Contact

* URL: `https://phonebook-app-assignment.onrender.com/contact/update`
* Method: PATCH
* Body: `id`,`name`,`contact`

#### Stored Procedure
---------------------

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "UpdateContact"(IN contact_id INT, IN new_name VARCHAR(100), IN new_phone VARCHAR(15))
BEGIN
    UPDATE contacts
    SET name = new_name, phone = new_phone
    WHERE id = contact_id;
END
```

### Delete Contact

* URL: `https://phonebook-app-assignment.onrender.com/contact/delete/(id)`
* Method: DELETE
* Params: `id`

#### Stored Procedure
---------------------

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "DeleteContact"(IN contact_id INT)
BEGIN
    DELETE FROM contacts WHERE id = contact_id;
END
```

### Create Avaliability

* URL: `https://phonebook-app-assignment.onrender.com/avalivility/post`
* Method: POST
* Body: `id`, `day`, `date`, `startTime`, `endTime`, `u_startTime`, `u_endTime`

#### Stored Procedure
---------------------

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "CreateContactAvailability"(
    IN p_contact_id INT,
    IN p_day VARCHAR(10),
    IN p_date DATE,
    IN p_start_time TIME,
    IN p_end_time TIME,
    IN p_unavailable_start TIME,
    IN p_unavailable_end TIME 
)
BEGIN
    DECLARE existing_count INT;

   
    SELECT COUNT(*) INTO existing_count 
    FROM contact_time_availability 
    WHERE contact_id = p_contact_id AND date = p_date;

   
    IF existing_count > 0 THEN
        UPDATE contact_time_availability
        SET 
            day = p_day,
            start_time = p_start_time,
            end_time = p_end_time,
            unavailable_start = p_unavailable_start,
            unavailable_end = p_unavailable_end
        WHERE contact_id = p_contact_id AND date = p_date;
    
   
    ELSE
        INSERT INTO contact_time_availability (
            contact_id, day, start_time, end_time, unavailable_start, unavailable_end, date
        ) 
        VALUES (
            p_contact_id, p_day, p_start_time, p_end_time, p_unavailable_start, p_unavailable_end, p_date
        );
    END IF;
    
END
```

### Delete Avaliability

* URL: `https://phonebook-app-assignment.onrender.com/avalivility/delete/(id)/(date)`
* Method: PATCH
* Params: `id`, `date`

#### Stored Procedure
---------------------

```
CREATE DEFINER="avnadmin"@"%" PROCEDURE "DeleteContactAvailability"(
    IN p_contact_id INT,
    IN p_date DATE
)
BEGIN
   
    DELETE FROM contact_time_availability 
    WHERE contact_id = p_contact_id AND date = p_date;
    
   
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No availability found for the specified contact_id and date.';
    END IF;
END
```