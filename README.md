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
	"id":"userid",<br/>
	"token":"<Your Token>"<br/>
}<br/>
 </code>

## To build the image
```
sudo docker build -t hobbs.evolvus.com:11083/bank-auth .
```

## To deploy the image to nexus
```
docker image push hobbs.evolvus.com:11083/bank-auth:latest
```

## To start the service
```
export TZ=Asia/Kolkata
export MONGO_DB_URL=mongodb://myUserAdmin:12356@192.168.1.152:27017/PlatformRelease_Test?poolSize=20&authSource=admin
export DEBUG=evolvus*
export NODE_LDAP_URL=ldap://domain.evolvus.com
export NODE_LDAP_BASEDN=dc=evolvus,dc=com
export NODE_LDAP_DOMAIN=@evolvus.com
export APPLICATION_CODE=CONSOLE

docker run --rm -d --name bank-auth-service -e TZ -e MONGO_DB_URL -e DEBUG -e NODE_LDAP_URL -e NODE_LDAP_BASEDN -e NODE_LDAP_DOMAIN -p 8098:8098 -p 389:389 --addhost ibl.com:10.24.120.55 182.72.155.166:10515/bank-auth:latest
```
