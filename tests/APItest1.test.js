import { test,request,expect} from '@playwright/test';
var chai = require('chai'); 
var assert_chai = chai.assert;    // variable for- assert style assertion
var expect_chai = chai.expect;  //variable for- expect style assertion

//import { should } from 'chai';

var primarytoken='125df5b6c2be5640f6381bf07a2b698bce29b066bebd08cce90c0bb12eef8d6a'
var newusername='Balaji'
var respbody
var respbodysize
var creatednewuserid

test('test1-property validation', async ({ request }) => {
  var get_response = await request.get('https://gorest.co.in/public/v2/users')
  
  //capture the array length
  respbodysize=await get_response.json()
  respbodysize=Object.keys(respbodysize).length

  //parse the responsestring to object
  respbody = JSON.parse(await get_response.text())

  ///expect style assertion
  expect_chai(respbody).to.be.an('array').that.is.not.empty;

  ///validate the length of the respbody payload array size
  assert_chai.lengthOf(respbody,10)
  
  ///validate the expecting property keys
  assert_chai.containsAllDeepKeys(respbody[0],['id','name','email','gender','status'])
  
  console.log('array size is: ', respbodysize)

 ///iterate all index and assert the username is not available
  for(let i=0; i<respbodysize;i++){
    assert_chai.doesNotHaveAnyDeepKeys(respbody[i].name,newusername)
    console.log(`${newusername}` + ' is not available in: '+ i)
   }
});

test('test2-create a new user', async ({ request }) => {
   var get_response=await request.post(`https://gorest.co.in/public/v2/users` + '?' + 'access-token=' + primarytoken,{

   extraHTTPHeaders: {
    'Accept': 'application/json',
    //'Authorization': `Bearer ${primarytoken}`,
  },
   data:
  {
    "name":"Balaji", 
   "gender":"male", 
   "email":"balaji@test.com", 
   "status":"active"
  }
})

//validate the status code
expect(get_response.status()).toBe(201)

  //parse the responsestring to object
  respbody = JSON.parse(await get_response.text())
  creatednewuserid=respbody.id
  console.log('new user id is: ', creatednewuserid)

})

test('test3-assert the newly created user', async ({ request }) => {
  var get_response = await request.get(`https://gorest.co.in/public/v2/users/${creatednewuserid}`+ '?' + 'access-token=' + primarytoken)
  
  //capture the array length
  respbodysize=await get_response.json()
  respbodysize=Object.keys(respbodysize).length
  console.log('The length is: ', respbodysize)

  //parse the responsestring to object
  respbody = JSON.parse(await get_response.text())
  console.log('The payload details: ',respbody)

  ///expect style assertion
  expect_chai(respbody).to.be.an('object').that.is.not.empty;

  ///validate the expecting property keys
   assert_chai.containsAllDeepKeys(respbody,['id','name','email','gender','status'])
   assert_chai.propertyVal(respbody,'id',creatednewuserid)
   assert_chai.propertyVal(respbody,'name',newusername)
  
});

test('test4-delete the newly created user and assert it', async ({ request }) => {
  var get_response = await request.delete(`https://gorest.co.in/public/v2/users/${creatednewuserid}`+ '?' + 'access-token=' + primarytoken)
  
  //parse the responsestring to object
  respbody = await get_response.text()
  console.log('The payload details: ',respbody)
  
 ///assert type chai assertion
  assert_chai.notInclude(respbody,'Resource not found')
  assert_chai.isEmpty(respbody)

  ///expect type chai assertion
  expect_chai(respbody).to.be.empty
});

   
 

