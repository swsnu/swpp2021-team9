from locust import HttpUser, between, task, TaskSet


class UserBehavior(TaskSet):
    def on_start(self):
        self.signin()

    @task
    def signin(self):
        res = self.client.get("/api/token/")
        csrf_token = res.cookies["csrftoken"]

        res = self.client.post(
            "/api/user/sigin/",
            json={"email": "test@test.com", "password": "testtest"},
            headers={"X-CSRFToken": csrf_token},
        )
        if res.status_code != 200:
            print(str(res.status_code) + " signin")

    @task
    def get_combinations_main(self):
        res = self.client.get("/api/combination/main/")

        if res.status_code != 200:
            print(str(res.status_code) + "combination main")


class WebsiteUser(HttpUser):
    host = "http://localhost:8000"
    task_set = UserBehavior
    wait_time = between(1, 5)

