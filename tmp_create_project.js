const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqZW5uZXRvcmF6bXlyYWRvd2EwNUBnbWFpbC5jb20iLCJpYXQiOjE3NzI1MTYyNTQsImV4cCI6MTc3NTEwODI1NH0.o3TNX_pAGoGzc78dS0qzR2qSagwlO8U9zYBy5jY1d4A';
const data = {
    project_name: "Demo Project Created by AI",
    generated_code: "console.log('Hello World');",
    user_prompt: "Create a demo project"
};

fetch('http://localhost:5000/api/projects', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => {
    console.log(JSON.stringify(json, null, 2));
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
