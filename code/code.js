var urlBase = 'https://covidcontacts.net/LAMP_API';
var extension = 'php';


var userId = 0;
var firstName = "";
var lastName = "";
var contactID = [];
var List = "";

function login()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var hash = SHA256(password);
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.id;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "Username/Password is incorrect.";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("username").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function addUser()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var confirmPassword = document.getElementById("confirmPassword").value;
	var hash = SHA256(password);
	
	document.getElementById("registerResult").innerHTML = "";

	var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "Login" : "' + login + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/AddUser.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{	
		if (!firstName)
		{
			document.getElementById("registerResult").innerHTML = "Please enter your first name.";
			return;
		}

		if (!lastName)
		{
			document.getElementById("registerResult").innerHTML = "Please enter your last name.";
			return;
		}

		if (!login)
		{
			document.getElementById("registerResult").innerHTML = "Please enter a username.";
			return;
		}

		if (!password)
		{
			document.getElementById("registerResult").innerHTML = "Please enter a password.";
			return;
		}

		if (!confirmPassword)
		{
			document.getElementById("registerResult").innerHTML = "Please confirm your password.";
			return;
		}

		if (password != confirmPassword)
		{
			document.getElementById("registerResult").innerHTML = "Passwords do not match.";
			return;
		}
		
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("registerResult").innerHTML = this.responseText;
			}
		};
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function addContact()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var email = document.getElementById("email").value;
	var phoneNumber = document.getElementById("phoneNumber").value;

	document.getElementById("addContactResult").innerHTML = "";

	var jsonPayload = '{"UserID" : "' + userId + '", "FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "PhoneNumber" : "' + phoneNumber + '", "Email" : "' + email + '"}';
	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		if (!firstName)
		{
			document.getElementById("addContactResult").innerHTML = "Please enter contact's first name.";
			return;
		}

		if (!lastName)
		{
			document.getElementById("addContactResult").innerHTML = "Please enter contact's last name.";
			return;
		}

		if (!email)
		{
			document.getElementById("addContactResult").innerHTML = "Please enter contact's email.";
			return;
		}

		if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
		{
			document.getElementById("addContactResult").innerHTML = "Please enter a valid email.";
		}
		
		if (!phoneNumber)
		{
			document.getElementById("addContactResult").innerHTML = "Please enter contact's phone number.";
			return;
		}

		if (!(/^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/.test(phoneNumber)))
		{
			document.getElementById("addContactResult").innerHTML = "Please enter a valid phone number.";
			return;
		}

		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addContactResult").innerHTML = this.responseText;
			}
		};
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

function editContact(contactid)
{
	var tableRow = document.getElementById(contactid);


	var firstNameCell = document.getElementById(contactid + "firstName");
	var lastNameCell = document.getElementById(contactid + "lastName");
	var phoneCell = document.getElementById(contactid + "phone");
	var emailCell = document.getElementById(contactid + "email");
	var editCell = document.getElementById(contactid + "editButton");

	var firstNameData = firstNameCell.innerHTML;
	var lastNameData = lastNameCell.innerHTML;
	var phoneData = phoneCell.innerHTML;
	var emailData = emailCell.innerHTML;

	firstNameCell.innerHTML = "<input type = 'text' id = '" + contactid + "firstNameInput' value = '" + firstNameData + "'>";
	lastNameCell.innerHTML = "<input type = 'text' id = '" + contactid + "lastNameInput' value = '" + lastNameData + "'>";
	phoneCell.innerHTML = "<input type = 'text' id = '" + contactid + "phoneInput' value = '" + phoneData + "'>";
	emailCell.innerHTML = "<input type = 'text' id = '" + contactid + "emailInput' value = '" + emailData + "'>";

	editCell.innerHTML = "<button class='button' type = 'button' onclick = 'saveContact(" + contactid + ");'>Save</button>";
}

function saveContact(contactid)
{
	var firstNameCell = document.getElementById(contactid + "firstName");
	var lastNameCell = document.getElementById(contactid + "lastName");
	var phoneCell = document.getElementById(contactid + "phone");
	var emailCell = document.getElementById(contactid + "email");
	var editCell = document.getElementById(contactid + "editButton");

	var firstNameValue = document.getElementById(contactid + "firstNameInput").value;
	var lastNameValue = document.getElementById(contactid + "lastNameInput").value;
	var phoneValue = document.getElementById(contactid + "phoneInput").value;
	var emailValue = document.getElementById(contactid + "emailInput").value;

	firstNameCell.innerHTML = firstNameValue;
	lastNameCell.innerHTML = lastNameValue;
	phoneCell.innerHTML = phoneValue;
	emailCell.innerHTML = emailValue;

	var jsonPayload = '{"ContactID" : "' + contactid + '", "FirstName" : "' + firstNameValue + '", "LastName" : "' + lastNameValue + '", "PhoneNumber" : "' + phoneValue + '", "Email" : "' + emailValue + '"}';
	var url = urlBase + '/EditContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{	
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactsResult").innerHTML = this.responseText;
			}
		};
	}
	catch(err)
	{
		document.getElementById("contactsResult").innerHTML = err.message;
	}

	editCell.innerHTML = "<button class='button' type = 'button' onclick = 'editContact(" + contactid + ");'>Edit</button>";
}

function deleteContact(contactid)
{
	document.getElementById(contactid).outerHTML="";

	var jsonPayload = '{"ContactID" : "' + contactid + '"}';
	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{	
		xhr.send(jsonPayload);
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactsResult").innerHTML = this.responseText;
			}
		};
	}
	catch(err)
	{
		document.getElementById("contactsResult").innerHTML = err.message;
	}

}

function searchContacts() {
	var search = document.getElementById("searchText").value;

	document.getElementById("searchResult").innerHTML = "";

	var jsonPayload = '{"search" : "' + search + '", "UserID" : "' + userId + '"}';
	var url = urlBase + '/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	List = " ";
	document.getElementById("searchTable").innerHTML = List;
	document.getElementById("contactsResult").innerHTML = "No contacts found!";
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				List += "<th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Date Added</th><th>Edit</th><th>Delete</th>";
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					var contactidnumber = jsonObject.results[i].split(' ')[6];
				    // starts new row with id of userid
					List += "<tr id='" + contactidnumber + "'>";
					// adds information to row
					var k = 0;

					// add "firstName" cell"
					List += "<td id ='" + contactidnumber + "firstName'>";
					List += jsonObject.results[i].split(' ')[0]
					List += "</td>";

					// add "lastName" cell"
					List += "<td id ='" + contactidnumber + "lastName'>";
					List += jsonObject.results[i].split(' ')[1]
					List += "</td>";
						
					// add "phone" cell"
					List += "<td id ='" + contactidnumber + "phone'>";
					List += jsonObject.results[i].split(' ')[2]
					List += "</td>";
						
					// add "email" cell"
					List += "<td id ='" + contactidnumber + "email'>";
					List += jsonObject.results[i].split(' ')[3]
					List += "</td>";
						
					// add "dateAdded" cell"
					List += "<td id ='" + contactidnumber + "dateAdded'>";
					List += jsonObject.results[i].split(' ')[4]
					List += "</td>";

					// Adds Edit button
					List += "<td id = '" + contactidnumber + "editButton'><button class='button' type='button' onclick='editContact(" + contactidnumber + ");'>Edit</button></td>";
					// Adds Delete button
					List += "<td id = '" + contactidnumber + "deleteButton'><button class='button' type='button' onclick='deleteContact(" + contactidnumber + ");'>Delete</button></td>";
					// finishes row
					List += "</tr>";
				}
				
				document.getElementById("searchTable").innerHTML = List;
				document.getElementById("contactsResult").innerHTML = "Contact(s) found!";
			}
			else
			{
				
				document.getElementById("contactsResult").innerHTML = "No contacts found!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("contactsResult").innerHTML = err.message;
	}
}