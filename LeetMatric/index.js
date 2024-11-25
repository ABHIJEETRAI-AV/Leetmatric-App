document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector("#search");
    const usernameInput = document.querySelector("#name");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy");
    const mediumProgressCircle = document.querySelector(".medium");
    const hardProgressCircle = document.querySelector(".hard");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".flashcards");





    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty ")
        }
        return 1;
    }
    async function fetchUserDetails(username) {
        const url = " https://leetcode.com/graphql";
        try {
            searchButton.textContent = "Searching...";
            searchButton.diabled = true;

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl + targetUrl, requestOptions);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            displayUserData(parsedData);
        }
        catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`

        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
            //     statsContainer.innerHTML= `<div class="progressbar">
            //     <div class="easy">easy</div>
            //     <div class="medium">medium</div>
            //     <div class="hard">hard</div>

            // </div>
            // <div class="flashcards">
            //     <div class="submissions">Overall submisions</div>
            //     <div class="easysubmissions">Overall easy submissions</div>
            //     <div class="mediumsubmissions">Overall medium submissions</div>
            //     <div class="hardsubmissions">Overall hard submission</div>
            // </div>`
        }
    }

    function displayUserData(parsedData) {
        const totalQuestions = parsedData.data.allQuestionsCount[0].count;
        const easyQuestions = parsedData.data.allQuestionsCount[1].count;
        const mediumQuestions = parsedData.data.allQuestionsCount[2].count;
        const hardQuestions = parsedData.data.allQuestionsCount[3].count;

        const solvedquestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyquestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumquestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardquestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;


        updateSubmissions(solvedquestions);
        updateEasySubmissions(solvedEasyquestions);
        updateMediumSubmissions(solvedMediumquestions);
        updateHardSubmissions(solvedHardquestions);
        updateEasyProgress(easyQuestions, solvedEasyquestions);
        updateMediumProgress(mediumQuestions, solvedMediumquestions);
        updateHardProgress(hardQuestions, solvedHardquestions);

    }
    function updateEasyProgress(totalQuestions, easyQuestions) {
        const percentEasy = (easyQuestions / totalQuestions) * 100;
        document.querySelector(".easy").style.background = `conic-gradient(#f6af08 ${percentEasy}%, #080300 0%)`;
    }
    function updateMediumProgress(totalQuestions, mediumQuestions) {
        const percentMedium = (mediumQuestions / totalQuestions) * 100;
        document.querySelector(".medium").style.background = `conic-gradient(#f6af08 ${percentMedium}%, #080300 0%)`;
    }
    function updateHardProgress(totalQuestions, hardQuestions) {
        const percentHard = (hardQuestions / totalQuestions) * 100;
        document.querySelector(".hard").style.background = `conic-gradient(#f6af08 ${percentHard}%, #080300 0%)`;
    }



    function updateSubmissions(solvedquestions) {
        document.querySelector(".totalSubmissions").innerHTML = `<p>: ${solvedquestions}</p>`;
    }
    function updateEasySubmissions(solvedEasyquestions) {
        document.querySelector(".easySubmissions").innerHTML = `<p>: ${solvedEasyquestions}</p>`;
    }
    function updateMediumSubmissions(solvedMediumquestions) {
        document.querySelector(".mediumSubmissions").innerHTML = `<p>: ${solvedMediumquestions}</p>`;
    }
    function updateHardSubmissions(solvedHardquestions) {
        document.querySelector(".hardSubmissions").innerHTML = `<p>: ${solvedHardquestions}</p>`;
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        // console.log(username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    })

})