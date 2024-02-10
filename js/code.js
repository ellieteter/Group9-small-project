const urlBase = 'http://infonest.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

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
	}
	try
	{
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


function addContact()
{
	console.log(document.getElementById("firstName"));
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("inputPhone").value;
	let email = document.getElementById("inputEmail").value;
	

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
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
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

// Call the function initially to load the count
updateContactCount();

setInterval(updateContactCount, 5000);



function updateUIWithContact(contact) {
    // Get the table body
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
				
                for (let i = 0; i < jsonObject.results.length; i++) {
					
					ids[i] = jsonObject.results[i].userId;
					text += "<tr id='row" + i + "'>";
					text += "<td>" + jsonObject.results[i].FirstName + "</td>";
					text += "<td>" + jsonObject.results[i].LastName + "</td>";
					text += "<td><span class='badge badge-soft-success mb-0'>" + jsonObject.results[i].Phone + "</span></td>";
					text += "<td>" + jsonObject.results[i].Email + "</td>";
					text += "<td>";
					text += "<ul class='list-inline mb-0'>";
					text += "<li class='list-inline-item'><button type='button' onclick='editRow(" + JSON.stringify(jsonObject) + "," + i + ")' class='btn btn-primary px-2' data-bs-toggle='tooltip' data-bs-placement='top' title='Edit'><i class='bx bx-pencil font-size-18'></i></button></li>";
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

function editRow(jsonObject, i)
{
	//userID;
	//let data = document.cookie;
	//let splits = data.split(",");
	/*for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
	
		if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}*/


	let firstNameI = jsonObject.results[i].FirstName;
    let lastNameI = jsonObject.results[i].LastName;
	let phone = jsonObject.results[i].Phone;
    let email = jsonObject.results[i].Email;
	let userId = jsonObject.results[i].userID

	var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    // Replace the inner HTML with input fields containing the current values
    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>";

	document.getElementById("contactUpdateResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,phone:phone,email:email,userId:userID};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
				loadContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
	
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
	let userID = jsonObject.results[i].userID
	
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
			}

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err.message);
	}
}



/*
function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
*/