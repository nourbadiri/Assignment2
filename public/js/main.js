/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Nour Badiri Student ID: 108435215 Date: 09/29/2023
*  Cyclic Link: https://glorious-goat-vestments.cyclic.app/
*
********************************************************************************/ 
var page = 1;
var perPage = 10;

function loadCompanyData(tag=null) {
    //set page number for current page text 
    document.querySelector('#current-page').textContent = page;
    
    //
    const apiUrl = `/api/companies?page=${page}&perPage=${perPage}${tag !== null ? `&tag=${tag}` : ""}`;
    console.log("ApiUrlIs",apiUrl);
    
    fetch(apiUrl)
                .then((res) => res.json())
                .then((data) => {
                    //console.log(data);
                    let postRows = data.map(companyObjectToTableRowTemplate).join('');
                    document.querySelector('#companiesTable tbody').innerHTML = postRows;



                               // add the "click" event listener to the newly created rows
                               document.querySelectorAll('#companiesTable tbody tr').forEach((row) => {
                                row.addEventListener('click', (e) => {
                                    let clickedId = row.getAttribute('data-id');
                                    console.log('clickedId:', clickedId);

                                    const apiUrl2 = `/api/company/${clickedId}`;
        
                                    fetch(apiUrl2)
                                    .then((res) => res.json())
                                    .then((data) => {
                                         console.log(data);
                                         
                                        document.querySelector('#detailsModal .modal-body').innerHTML = companyDetailToModal(data);
                                        document.querySelector('.modal-title').textContent = data.name;

                                        let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                                            backdrop: "static",
                                            keyboard: false
                                        });
        
                                        modal.show();
                                        
                                    }); 
                                });
                            });



                });
   
}

function companyObjectToTableRowTemplate (post){
    var firstTwoTags="--";
    if (post.tag_list) {
        firstTwoTags = post.tag_list.split(', ').slice(0,2).join(", ");
    }
      
    return  `<tr data-id=${post.name}>
    <td>${post.name}</td>
    <td>${post.category_code}</td>
    <td>${post.description}</td>
    <td>${post.founded_month === null ? "--" : post.founded_month }/${post.founded_day === null ? "--": post.founded_day}/${post.founded_year===null ? "--" : post.founded_year}</td>
    <td>${post.relationships[0].person.first_name} ${post.relationships[0].person.last_name}</td>
    <td>${post.offices[0].city},${post.offices[0].state_code},${post.offices[0].country_code}</td>
    <td>${ (post.number_of_employees) ? post.number_of_employees : "--" }</td>
    <td>${firstTwoTags}</td>
    <td>${post.homepage_url}</td>
    </tr>`;

}

function companyDetailToModal(post){
    let tag_list = `${post.tag_list.split(',').map((item) => `<li>${item}</li>`).join('')}`;
    let product_list = `${post.products.map((item) => `<li>${item.name}</li>`).join('')}`;
    let year = (post.founded_year) ? post.founded_year: null;
    let month = (post.founded_month) ? post.founded_month : null;
    let day = (post.founded_day) ?  post.founded_day : null;
    let date = new Date(year, month - 1, day).toDateString();
    let people_list = `${post.relationships.map((item) => item.person.first_name + " " + item.person.last_name + " (" + ((item.title) ? item.title : "n/a") +") " )}`


  //date.toLocaleString("en-US", options)
    return `<strong>Category:</strong> ${(post.category_code) ? post.category_code : "n/a" }<br /><br />
            <strong>Description:</strong> ${(post.description) ? post.description : "n/a" }<br /><br />
            <strong>Overview:</strong> ${(post.overview) ? post.overview : "n/a" }
            <strong>Tag List:</strong> 
            <ul>${(tag_list) ? tag_list : "n/a"}</ul>
            <strong>Founded:</strong> ${date}<br /><br />
            <strong>Key People:</strong> ${people_list}<br /><br />
            <strong>Products:</strong> 
            <ul>${(product_list) ?  product_list : "n/a"}</ul>
            <strong>Number of Employees:</strong> ${(post.number_of_employees) ? post.number_of_employees : "n/a"}<br/><br />
            <strong>Website:</strong><a href="${post.homepage_url}"> ${post.homepage_url}</a><br /><br />
            `
}




   // Execute when the DOM is 'ready'
   document.addEventListener('DOMContentLoaded', function () {
     console.log("DOM loaded");
     

    //Load first set of data
    loadCompanyData(tag=null)

    // listen to submit button
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();

        loadCompanyData(document.querySelector('#tag').value);

    });

    // listen to clear form button
    document.querySelector('#clearForm').addEventListener('click', (event) => {
        console.log("clearform clicked");
        // prevent the form from from 'officially' submitting
        event.preventDefault();

        document.querySelector("#tag").value= " ";
        loadCompanyData();
    });

    // listen to previous page button
    document.querySelector('#previous-page').addEventListener('click', (event) => {
        console.log("previous page clicked");
        // prevent the form from from 'officially' submitting
        event.preventDefault();

        if (page>1){
            page--;
        }
        loadCompanyData();
    });

       // listen to next page button
       document.querySelector('#next-page').addEventListener('click', (event) => {
        console.log("next page clicked");
        // prevent the form from from 'officially' submitting
        event.preventDefault();

        page++;
        loadCompanyData();
    });
 


});