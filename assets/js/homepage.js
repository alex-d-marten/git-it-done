var userFormEl = document.querySelector('#user-form');
var nameInputEL = document.querySelector('#username');
var repoSearchTerm = document.querySelector('#repo-search-term');
var repoContainerEl = document.querySelector('#repos-container');

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var username = nameInputEL.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEL.value = "";
    } else {
        alert("Please enter a GitHub username.");
    }
}

var getUserRepos = function(user) {
    // format github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
        });
        } else {
            alert("Error: GitHub user not found!");
        }
    })
    .catch(function(error) {
        // Notice this '.catch()' getting chained to the end of the '.then()' method
        alert("Unable to connect to GitHub");
    })
};

var displayRepos = function(repos, searchTerm) {
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found!";
        return;
    }

    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    for (var i=0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // creat a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(statusEl);

        // append contrainer to the DOM
        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit", formSubmitHandler)