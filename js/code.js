const urlBase = 'http://infonest.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
	// let tmp = {login: login, password: password};
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
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				
				window.location.href = "contacts.html";
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
	let username = document.getElementById("usrname").value;
	let password = document.getElementById("loginPassword").value;

	// Regular expression for the password pattern
	let passwordPattern = new RegExp('(?=.*\\d)(?=.*[\\W_])(?=.*[A-Z]).{8,20}');

	
	// Check if the password matches the pattern
	if (!passwordPattern.test(password)) {
		console.log("I got hit!");
		document.getElementById("registerResult").innerHTML = "Password does not meet the required criteria.";
		return; // Exit the function if the password is invalid
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
		if (!passwordPattern.test(password)) {
			console.log("I got hit in the readystatechange!")
			document.getElementById("registerResult").innerHTML = "Password does not meet the required criteria.";
			return; // Exit the function if the password is invalid
		}


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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("inputPhone").value;
	let email = document.getElementById("inputEmail").value;
	let userID = document.getElementById("inputUserID").value;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,phone:phone,email:email,userID,userID};
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
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

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
