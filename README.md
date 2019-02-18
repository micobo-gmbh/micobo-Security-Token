### Azhos Smart Contracts

#####Components

There are 4 main components:

1. _AOS Token Contract_  
2. _Constraint Logic Contract_ (CLC)  
3. _Dividend Contract_         (DC)  
4. _Administration Contract_

##

   CLC and CD will both be made **updatable** through the use of proxy contracts.  
   This means that their storage memory will persist when new versions are deployed.
   
##

The Administration contract will assign addresses with one or more of these **abilities**:

- **update** CLC and DC
- **pause** AOS Token Contract
- **edit constraints** in CLC (such as whitelist etc)

#
####Architecture

![architecture](./resources/Azhos_Architecture.jpg)

