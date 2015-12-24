# Amity
Amity aims to be a fast and straitforward tool to create AWS functions and resources. Written completely in Node.js it relies only on aws sdk for NodeJS, thus exposing allthe functionalities of the project manager tool to be invoked at runtime.

# Amity and Serverless (aka JAWS)
Amity took great inspiration from JAWS people and their idea of a cloud project manager made us dream of a better world. Unfortunately JAWS is really a complex project and has a big development cycle. Some basic assumptions (like using CloudFormation as a common middle layer) found our understanding, but not our approval: we were looking for a tool that can be used interactively within our projects and in the near future also as standalone Lambda function deployed on AWS (maybe exposing its capabilities through a set of REST APIs).
Sounds cool, eh? Unfortunately Serverless approach cuts off this possibility both in the near and far future. This is not what we love and the way (in our very humble opinion) serverless projects will be managed.
So, this meant we've to start over with a new project that could (hopefully) merge into JAWS/Serverless in the near future, adding Amity capabilities to every Serverless powered project.

Basically Amity differs from Serverless for a couple of capabilities:
* provides JS Objects modeling AWS Resources
* can be used in interactive mode (add/remove a single resource or function)
* does not rely on CloudFormation Syntax (which can be cumbersome and does not allow for AWS services such as APIGateway and Cloudsearch)

# 
