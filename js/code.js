const urlBase = 'http://infonest.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName ="";
let updatefirstName = "";
let updatelastName = "";
let updatephone = "";
let updateemail = "";
const ids = []
let pageNumber = 1;
let pageSize = 10; //

// Call the function initially to load the count
updateContactCount();

setInterval(updateContactCount, 3000);

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login: login, password: hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				
				window.location.href = "contacts.html";
			}

			else if(this.status == 409)
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
			
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let username = document.getElementById("inputUsername").value;
	let password = document.getElementById("inputPassword").value;

	let passwordPattern = new RegExp('(?=.\d)(?=.[\W_])(?=.*[A-Z]).{8,20}');


    // Check if the password matches the pattern
    if (!passwordPattern.test(password)) {
        document.getElementById("registerResult").innerHTML = "Password does not meet the required criteria.";
        return; 
    }

	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";

	var tmp = {firstName: firstName, lastName: lastName, login: username, password: hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
	xhr.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			let jsonObject = JSON.parse( xhr.responseText );
			userId = jsonObject.id;
			document.getElementById("registerResult").innerHTML = "User has been added!";

			firstName = jsonObject.firstName;
			lastName = jsonObject.lastName;

			saveCookie();

			
			window.location.href = "contacts.html";
		}
		else if (this.status == 409)
		{
			document.getElementById("registerResult").innerHTML = "User already exists";

		}
		else 
		{
			document.getElementById("registerResult").innerHTML = "Server error: " + this.status;
		}
	};
	xhr.send(jsonPayload);
}
	catch (err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function validateContactForm() {
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let inputPhone = document.getElementById("inputPhone");
    let inputEmail = document.getElementById("inputEmail");

    let phonePattern = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{4}$");
    let emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

    let validationMessages = [];

    if (!firstName.value.trim()) {
        validationMessages.push("First Name is required.");
    }

    if (!lastName.value.trim()) {
        validationMessages.push("Last Name is required.");
    }

    if (!phonePattern.test(inputPhone.value)) {
        validationMessages.push("Phone Number must be in the format ###-###-####.");
    }

    if (!emailPattern.test(inputEmail.value)) {
        validationMessages.push("Please enter a valid Email Address.");
    }

    if (validationMessages.length > 0) {
        alert(validationMessages.join("\n"));
        firstName.focus();
        return false;
    }

    return true;
}


function validateUpdateContactForm() {
    let upfirstName = document.getElementById("edit_firstName");
    let uplastName = document.getElementById("edit_lastName");
    let upinputPhone = document.getElementById("edit_inputPhone");
    let upinputEmail = document.getElementById("edit_inputEmail");

    let phonePattern = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{4}$");
    let emailPattern = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");

    let validationMessages = [];

    if (!upfirstName.value.trim()) {
        validationMessages.push("First Name is required.");
    }

    if (!uplastName.value.trim()) {
        validationMessages.push("Last Name is required.");
    }

    if (!phonePattern.test(upinputPhone.value)) {
        validationMessages.push("Phone Number must be in the format ###-###-####.");
    }

    if (!emailPattern.test(upinputEmail.value)) {
        validationMessages.push("Please enter a valid Email Address.");
    }

    if (validationMessages.length > 0) {
        alert(validationMessages.join("\n"));
        firstName.focus();
        return false;
    }

    return true;
}



function addContact()
{
	console.log(document.getElementById("firstName"));
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("inputPhone").value;
	let email = document.getElementById("inputEmail").value;

	if (!validateContactForm())
	{
		document.getElementById("contactAddResult").innerHTML = "Failed - Fields empty or missing criteria";
		return;
	}
	
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,phone:phone,email:email,userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				console.log("Contact added successfully:", tmp);
				updateUIWithContact(tmp);
				location.reload();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	 // Adding event listener to clear the content when 'x' button is clicked
	 let closeButton = document.getElementById("addcon_close");
	 if (closeButton) {
		 closeButton.addEventListener("click", function() {
			 document.getElementById("contactAddResult").innerHTML = "";
		 });
	 }
}


function updateContactCount() {

	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		
		if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	var tmp = {userId: userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/LoadContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				var count = jsonObject.Count;
		
				document.getElementById('contactCount').textContent = '(' + count + ')';
				document.getElementById('pageCount').textContent = 'Showing '+ count % 10+' to 10 of'+ count;
			}
			else if(this.status == 409)
			{
				document.getElementById('contactCount').textContent = '(0)';
			}
			
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.error('Error fetching data:', err);
	}
}




function updateUIWithContact(contact) {
    
    let tableBody = document.querySelector(".project-list-table tbody");
    // Create a new row
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${contact.firstName} </td>
		<td>${contact.lastName}</td>
        <td><span class="badge badge-soft-info mb-0">${contact.phone}</span></td>
        
        <td>${contact.email}</td>
        <td>
            <ul class="list-inline mb-0">
                <li class="list-inline-item">
					<button type="button" class="btn btn-primary px-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
						<i class="bx bx-pencil font-size-18"></i>
					</button>
                </li>
                <li class="list-inline-item">
					<button type="button" class="btn btn-danger px-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
						<i class="bx bx-trash-alt font-size-18"></i>
					</button>
                </li>
            </ul>
        </td>
    `;
    // Append the new row to the table
    tableBody.appendChild(newRow);
}



function loadContacts()
{

	let tmp = {userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/LoadContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"

				let startIndex = (pageNumber - 1) * pageSize;
    			let endIndex = Math.min(startIndex + pageSize, jsonObject.results.length);
				
                for (let i = startIndex; i < endIndex; i++) {
					ids[i] = jsonObject.results[i].userId;
					text += "<tr id='row" + i + "'>";
					text += "<td>" + jsonObject.results[i].FirstName + "</td>";
					text += "<td>" + jsonObject.results[i].LastName + "</td>";
					text += "<td><span class='badge badge-soft-success mb-0'>" + jsonObject.results[i].Phone + "</span></td>";
					text += "<td>" + jsonObject.results[i].Email + "</td>";
					text += "<td>";
					text += "<ul class='list-inline mb-0'>";
					text += "<li class='list-inline-item'><button type='button' onclick='editRow(" + JSON.stringify(jsonObject) + "," + i + ")' class='btn btn-primary px-2' data-bs-toggle='modal' data-bs-target='#EditcontactModal' data-bs-placement='top' title='Edit'><i class='bx bx-pencil font-size-18'></i></button></li>";
					text += "<li class='list-inline-item'><button type='button' onclick='deleteRow(" + JSON.stringify(jsonObject) + "," + i + ")' class='btn btn-danger px-2' data-bs-toggle='tooltip' data-bs-placement='top' title='Delete'><i class='bx bx-trash-alt font-size-18'></i></button></li>";
					text += "</ul>";
					text += "</td>";
					text += "</tr>";
				}
				text += "</table>";
				document.getElementById("contactsTableBody").innerHTML = text;
				
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


function nextPage() {
    pageNumber++;
    loadContacts();
}

function previousPage(event) {
	event.preventDefault()
    if (pageNumber > 1) {
        pageNumber--;
        loadContacts();
    }
}


function editRow(jsonObject, i) {
    updatefirstName = jsonObject.results[i].FirstName;
    updatelastName = jsonObject.results[i].LastName;
    updatephone = jsonObject.results[i].Phone;
    updateemail = jsonObject.results[i].Email;

    // Set the values of modal fields
    document.getElementById("edit_first").textContent = updatefirstName;
    document.getElementById("edit_last").textContent = updatelastName;
    document.getElementById("edit_phone").textContent = updatephone;
    document.getElementById("edit_email").textContent = updateemail;

}


// Update contact function
updateContact = function() {

	document.getElementById("contactAddResult").innerHTML = "";

	let newFirstName = document.getElementById("edit_firstName").value;
	let newLastName = document.getElementById("edit_lastName").value;
	let newPhone = document.getElementById("edit_inputPhone").value;
	let newEmail = document.getElementById("edit_inputEmail").value;

	if (!validateUpdateContactForm())
{
	document.getElementById("contactUpdateResult").innerHTML = "Failed - Fields empty or missing criteria";
	return;
}

	var tmp = {NEWfirstName:newFirstName,NEWlastName:newLastName,NEWphone:newPhone,NEWemail:newEmail,userId:userId,OLDfirstName:updatefirstName,OLDlastName:updatelastName,OLDphone:updatephone,OLDemail:updateemail};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
				loadContacts();
				location.reload();
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}

	updatefirstName = "";
    updatelastName = "";
    updatephone = "";
    updateemail = "";
}

// ================ For login ------------------------
document.addEventListener("DOMContentLoaded", function()
{
	const loginText = document.querySelector(".title-text .login");
	const loginForm = document.querySelector("form.login");
	const loginBtn = document.querySelector("label.login");
	const signupBtn = document.querySelector("label.signup");
	const signupLink = document.querySelector("form .signup-link a");
	
	signupBtn.onclick = (()=>{
	  loginForm.style.marginLeft = "-50%";
	  loginText.style.marginLeft = "-50%";
	});
	
	loginBtn.onclick = (()=>{
	  loginForm.style.marginLeft = "0%";
	  loginText.style.marginLeft = "0%";
	});
	
	signupLink.onclick = (()=>{
	  signupBtn.click();
	  return false;
	});
});

function deleteRow(jsonObject, i)
{
	let firstName = jsonObject.results[i].FirstName;
    let lastName = jsonObject.results[i].LastName;
	let phone = jsonObject.results[i].Phone;
    let email = jsonObject.results[i].Email;
	let userID = jsonObject.results[i].userId
	
	var tmp = {firstName: firstName, lastName: lastName, phone:phone, email:email, userID:userID};
	
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				loadContacts();
				location.reload();
			}

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}
}




function searchContact()
{
	
	let srch = document.getElementById("searchInput").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				if (jsonObject.results && jsonObject.results.length > 0) {
                    document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
                    
                    for (let i = 0; i < jsonObject.results.length; i++) {
                        let contact = jsonObject.results[i];
                        
						contactList += "<tr><td>" + contact.FirstName + "</td><td>" + contact.LastName + "</td><td>" + contact.Phone + "</td><td>" + contact.Email + "</td><td>";
						contactList += "<ul class='list-inline mb-0'>";
						contactList += "<li class='list-inline-item'><button type='button' onclick='editRow(" + JSON.stringify(jsonObject) + "," + i + ")' class='btn btn-primary px-2' data-bs-toggle='modal' data-bs-target='#EditcontactModal' data-bs-placement='top' title='Edit'><i class='bx bx-pencil font-size-18'></i></button></li>";
						contactList += "<li class='list-inline-item'><button type='button' onclick='deleteRow(" + JSON.stringify(jsonObject) + "," + i + ")' class='btn btn-danger px-2' data-bs-toggle='tooltip' data-bs-placement='top' title='Delete'><i class='bx bx-trash-alt font-size-18'></i></button></li>";
						contactList += "</ul>";
						contactList += "</td></tr>";

						
                    }
                   
                    document.getElementById("contactsTableBody").innerHTML = contactList;

                } else {
                    document.getElementById("contactSearchResult").innerHTML = "No contacts found.";
                }
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function clearSearch() {
    //clears the search input
    document.getElementById("searchInput").value = "";
    
    loadContacts(); 
}
