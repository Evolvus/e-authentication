module.exports = {

    url           : process.env.NODE_LDAP_URL || "ldap://domain.evolvus.com",
    baseDN        : process.env.NODE_LDAP_BASEDN || "dc=evolvus,dc=com",    
    domain        : process.env.NODE_LDAP_DOMAIN || "@evolvus.com" 

} 