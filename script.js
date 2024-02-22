// GitHub API 요청을 처리하는 클래스
class GitHub { 

    constructor() { // 클래스 생성자
        this.base_url = 'https://api.github.com/users/'; // GitHub 사용자의 기본 URL 설정 
        //api라는 개념을 notion에 정리 했음.  여기서는 내가 client github이 server 가되는데 
        // github한테서 JSON 형식으로 데이터를 받아오고 싶어서 https://api.github.com/users/ 라는 도메인을 이용하는 거임
        //JSON :   JavaScript가 통신 하기 위해서 만든 JavaScript Object = 자바스크립트 객체화 시킨거임
        //근데 JavaScript랑 JSON이랑 완전 같은건 아니라서 보통 변환을 시켜줘야함 
    }

    // 사용자의 이름을 받으면 프로필, 레포지토리 정보를 가져오는 메서드
    async getUser(username) { // async는 promise를 반환해줌 항상 
        const profileResponse = await fetch(`${this.base_url}${username}`); // 프로필 정보 가져오기
        const profile = await profileResponse.json(); // 위에서 말한것처럼 JavaScript랑 JSON이랑 완전 같은건 아니기 때문에 보통 변환을 시켜주는데
        // 그경우에 fetch로 프로필의 정보를 가져오고 그걸 .json형태로 바꾸어서 읽어준다.

        const reposResponse = await fetch(`${this.base_url}${username}/repos`); // 레포지토리 정보 가져오기
        const repos = await reposResponse.json(); // 비동기함수 응답을 기다리기 (await)
        // 똑같이 Repository도 fetch로 giuhub 서버에서 데이터를 받아오고 그걸 . json의 형태로 변경해준다.

        return { profile, repos }; // 프로필 정보, 레포지토리 정보를 객체 형태로 반환
    }
}

// UI 업데이트를 처리하는 클래스
class UI {
    showProfile(user) { // 프로필 정보를 HTML 형태로 변환하는 메서드
        //$user.avatar_url 이나 $user.public_repos 같은 녀석들은 github 서버에서 가져오는 객체라고 생각하면된다. 
        // span이나 li 클래스 에서 보게 되면 .col-md-9 같은 녀석들은 . bootstrap의  클래스 일부를 떼온 것이다.
        const profileHTML = `
        <div class="card card-body mb-3">
        <div class="row">
            <div class="col-md-3">
                <img class="img-fluid mb-2" src="${user.avatar_url}">  
                <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
            </div>
            <div class="col-md-9">
                <span class="badge bg-primary">Public Repos: ${user.public_repos}</span>
                <span class="badge bg-secondary">Public Gists: ${user.public_gists}</span>
                <span class="badge bg-success">Followers: ${user.followers}</span>
                <span class="badge bg-info">Following: ${user.following}</span>
                <br><br>
                <ul class="list-group">
                    <li class="list-group-item">Company: ${user.company}</li>
                    <li class="list-group-item">Website/Blog: ${user.blog}</li>
                    <li class="list-group-item">Location: ${user.location}</li>
                    <li class="list-group-item">Member Since: ${user.created_at}</li>
                </ul>
            </div>
        </div>
    </div>
`;
        document.getElementById('profile').innerHTML = profileHTML; // 위에서짠 HTML을 실제로 내 화면에 보여줘야 하기때문에 logic이 여기까지 이어져야한다
        // innerHTML을 이용해서
    }

    showRepos(repos) {  //Repository의 정보를 보여주는 repos
        let reposHTML = '<h3 class="page-heading mb-3">Latest Repos</h3>';
        repos.forEach(repo => { //각 리스트 요소에 맞게 전부 도는데. 현재 지금 내가 github 서버로 부터 받아온 Repo개수가 3개면 3번 반복을 한다고
            // 이해하면된다.
            reposHTML += `
                <div class="card card-body mb-2">
                    <div class="row">
                        <div class="col-md-6">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        <div class="col-md-6">
                            <span class="badge bg-primary">Stars: ${repo.stargazers_count}</span>
                            <span class="badge bg-secondary">Watchers: ${repo.watchers_count}</span>
                            <span class="badge bg-success">Forks: ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById('profile').innerHTML += reposHTML; // 똑같이 HTML 코드를 짯기 때문에 . 실제로 DOM 객체를 이용해서 innerHTML 값에 넣어줘야함.
    }

    showAlert(message, className) { // 경고 메세지를 출력하기 위해서 
        // 이전에 존재하는 경고 메시지 제거
        this.clearAlert();//저번에 본 clear 속성은 보통 지운다라는 의미가 생긴다
    
        // 경고 메시지 생성
        const div = document.createElement('div'); //div 태그를 만들고 
        div.className = className; // 매개변수의 class name을 이어 받고 
        div.appendChild(document.createTextNode(message)); // 경고 메세지를 Create 할건데 , 그건 뭐 어차피 다음 자식으로 추가해도되니까
        //appendChild 라는 메소드를 이용해서 씀 .
    
        // 경고 메시지를 페이지에 추가
        const container = document.querySelector('.SearchContainer'); // div 태그 쪽에 있는 클래스이름
        const search = document.querySelector('.search');//div 태그 쪽에 있는 클래스이름
        container.insertBefore(div, search);//insertBefore? 
        //insertBefore()은 자식 노드 목록 끝 외에 삽입 위치를 조정하는것이 필요할 때 사용.
        //
    
        // 3초 후 경고 메시지 제거 setTimeout 뒤의 두번째 인수는 밀리 세컨드 =10-3 이고 지금 3000이니까 3초가 맞음.
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }
    
    clearAlert() { // 경고메세지를 초기화 하는 부분. 
        const currentAlert = document.querySelector('.alert');
        if (currentAlert) {
            currentAlert.remove();//경고 메세지 제거 
        }
    }
    


}

// GitHub 클래스의 인스턴스 생성
const github = new GitHub();

// UI 클래스 인스턴스 생성
const ui = new UI(); 

// Event Listeners: 사용자가 버튼을 클릭하면 함수 실행
document.getElementById('searchBtn').addEventListener('click', () => {

    // 사용자가 입력한 텍스트 가져오기
    const userText = document.getElementById('searchUser').value; //이게 사실상 username의 값을 가져오는 거라고 이해할수 있음
    //document 객체로 searchUser에 연결 한다음에 .value로 값을 가져옴.
    
    if (userText !== '') { // 빈 문자열인지 확인
        github.getUser(userText) // github 클래스의 getUser 메소드 사실상 username을 직접 보내주는거임.
        //getUser Method가 지금 사실상 async await기 떄문에 ,  promise 객체를 이용할때 쓰던 .then (데이터를 받고 그다음에 뭐할거임?) 으로 가지는거임.
        //getUser는 return 값으로 profile과 repo 값을 반환합니다. ! 
            .then(data => { // data라는 매개변수를 보낼때 일어날 함수 설정 .
                if (data.profile.message === 'Not Found') { // UI에서 사용자가 발견되지 않았다는 메시지 표시
                    ui.showAlert(data.profile.message, 'alert alert-danger'); // 경고 메시지 표시
                } else { 
                    ui.showProfile(data.profile); // 사용자 프로필 정보 표시
                    ui.showRepos(data.repos); // 사용자 레포지토리 정보 표시
                }
            });
    }
});

