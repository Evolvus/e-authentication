# e-authentication

This service uses evolvus-user module to authenticate user credentials. <br/>

## API
### Authentication API
------------------------
Method :'POST'<br/>
Request URL : 'http://localhost:8087/api/user/authenticate'<br/>
Content-Type:'application/json'<br/>
Request Body:<br/>
<code>
{<br/>
	"userName":"name",<br/>
	"userPassword":"password",<br/>
	"applicationCode":"code"<br/>
}<br/>
 </code>
 
 ### Token Update API
 ---------------------
Method :'POST'<br/>
Request URL : 'http://localhost:8087/api/user/updateToken'<br/>
Content-Type:'application/json'<br/>
Request Body:<br/>
<code>
{<br/>
	"userName":"name",<br/>
	"applicationCode":"code"<br/>
}<br/>
 </code>

