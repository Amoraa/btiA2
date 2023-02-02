/*********************************************************************************
* BTI425 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: ___________Tatiana Kashcheeva___________ Student ID: ____148366206______________ Date: _______February 2 2023_____________
*
********************************************************************************/
var page = 1;
const perPage = 10;

function loadMovieData(title = null) {

    

    var api = `https://fine-gray-clam-sari.cyclic.app/api/movies?page=${page}&perPage=${perPage}`
    if (title != null) {
        api += `&title=${title}`
        document.getElementById("page").classList.add("d-none")

    }
    else {
        document.getElementById("page").classList.remove("d-none")

    }

    fetch(api)
        .then(function (res) {
            return (res.json());
        })
        .then(function (data) {
            console.log(data)

            let postRows = `${data.map(post => (
                `<tr data-id=${post._id}>
                                <td>${post.year}</td>
                                <td>${post.title}</td>
                                <td>${(post.plot != undefined) ? post.plot : "N/A"}</td>
                                <td>${(post.rated != undefined) ? post.rated : "N/A"}</td>
                                <td>${`${Math.floor(post.runtime / 60)}:${(post.runtime % 60).toString().padStart(2, '0')}`}</td>
                               
                            </tr>`
            )).join('')}`

            document.getElementById("tbod").innerHTML = postRows;
            document.getElementById("current-page").innerText = page
            document.querySelectorAll('#moviesTable tbody tr').forEach(row => {
                row.addEventListener("click", e => {
                    let clickedId = row.getAttribute("data-id");
                    console.log(clickedId)
                    fetch(`https://fine-gray-clam-sari.cyclic.app/api/movies/${clickedId}`).then(res => res.json()).then(data => {
                        console.log(data)

                        let commentsList=(data.poster!=undefined)?`<img class="img-fluid w-100" src=${data.poster}><br><br>`:""
                         commentsList += `
                                
                                <strong>Directed By:</strong> ${data.directors.join(',')}<br><br>
                                <p>${(data.fullplot!=undefined)?data.fullplot:"N/A"}</p>
                                <strong>Cast: </strong> ${(data.cast!=undefined)?data.cast.join(','):"N/A"}<br><br>
                                <strong>Awards: </strong>${data.awards.text} <br>
                                <strong>IMDB Rating: </strong> ${data.imdb.rating} (${data.imdb.votes} votes)`
                    
                            console.log(commentsList)
                            document.querySelector("#detailsModal .modal-body").innerHTML = commentsList;

                            let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                                backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
                                keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                                focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
                              });
                              
                              myModal.show();

                    })
                    
                })
            });

        })
        .catch(function (err) {
            console.log(err)
        })

}

document.addEventListener('DOMContentLoaded', (event) => {

    loadMovieData()
    document.querySelector("#searchForm").addEventListener('submit', event => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();
        // populate the posts table with the userId value
        console.log(document.querySelector("#title").value) 
        page=1;
        loadMovieData(document.querySelector("#title").value);
       

    
    });

    document.querySelector("#clearForm").addEventListener('click', event => {
        document.querySelector("#title").value=""
    });

    document.querySelector("#previous-page").addEventListener('click', event => {
        if (page>1)
        {
            page--;
            loadMovieData()
        }
    });

    document.querySelector("#next-page").addEventListener('click', event => {
        page++;
        loadMovieData()
    });

});