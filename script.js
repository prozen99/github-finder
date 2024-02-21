//gitHub API 요청을 처리하는 클래스
// 순서상 먼저 API 연결
class GitHub{
    constructor() // 생성자
    {
        this.base_url='https://api.github.com/users/'; //GitHub 사용자의 기본url.
        //https://github.com/prozen99 이런 형식이니까.
    }

    //비동기 처리 이용하는 부분인데
    //이걸 이용하는 문법은 Async await를 이용한다. 

    async getUser(username)
    {
        const profileResponse=await fetch(`${this.base_url}${username}`);
        //프로필 정보를 가져오는 부분.
        /*
        Fetch API는 HTTP 파이프라인을 구성하는 요청과 응답 등의 요소를 JavaScript에서
        접근하고 조작할 수 있는 인터페이스를 제공합니다. Fetch API가 제공하는 전역
        fetch() 메서드로 네트워크의 리소스를 쉽게 비동기적으로 취득할 수도 있습니다.
        */
       const profile=await profileResponse.json();//프로필 가져온 값을 Json으로 변환

       const reposResponse=await fetch(`${this.base_url}${username}/repos`);//repository 정보
       const repos=await reposResponse.json();// 비동기함수 응답을 기다리기

       return{profile,repos}; //프로필 정보 , repo정보를 객체 형태로 반환. 
    }


}

//UI 업데이트를 처리하는 클래스
class UI{
    showProfile(user)//프로필 정보를 HTML 형태로 변환하는 메소드.
    {
        const profileHTML=`
        <div class="card card-body mb-3">
        <div class="row"
        
        
        
        `
    }
}
