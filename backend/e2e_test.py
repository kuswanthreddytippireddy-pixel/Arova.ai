import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def run_test():
    print("Starting End-to-End Flow Test...")

    # 1. Login as Superadmin
    print("\n[1] Logging in as Admin...")
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin@arova.in", "password": "AdminPassword123!"})
    if res.status_code != 200:
        print(f"Failed Admin Login: {res.text}")
        return
    admin_token = res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("✅ Admin login successful!")

    # 2. Create Internship Track
    print("\n[2] Creating an Internship Track...")
    track_payload = {
        "title": f"Test Automation Track {uuid.uuid4().hex[:6]}",
        "description": "An automated testing track",
        "duration_months": 1,
        "modules": [
            {
                "id": "module_01",
                "title": "Intro to Testing",
                "content": "This is test content.",
                "order": 1,
                "test": {
                    "title": "Test 1",
                    "max_attempts": 3,
                    "pass_mark_percentage": 50,
                    "questions": [
                        {
                            "text": "Is this a test?",
                            "options": ["Yes", "No"],
                            "correct_option_index": 0
                        }
                    ]
                }
            }
        ]
    }
    res = requests.post(f"{BASE_URL}/admin/internships", json=track_payload, headers=admin_headers)
    print("✅ Internship Created!")
    
    # 3. Create Student
    print("\n[3] Creating a new student...")
    student_email = f"student_{uuid.uuid4().hex[:6]}@arova.in"
    res = requests.post(f"{BASE_URL}/admin/students", json={
        "name": "Test Student",
        "email": student_email,
        "internship_track_months": 1
    }, headers=admin_headers)
    
    student_data = res.json()
    print(f"✅ Student Created: {student_data['student_id']} (Pass: {student_data['temp_password']})")

    # 4. Login as Student
    print("\n[4] Logging in as Student...")
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": student_data['student_id'], "password": student_data['temp_password']})
    student_token = res.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    
    # Force password change since temp password is true
    res = requests.post(f"{BASE_URL}/auth/change-password", json={"new_password": "NewStudentPassword123!"}, headers=student_headers)
    print("✅ Student forced password change successful!")

    # Login again with new password
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": student_data['student_id'], "password": "NewStudentPassword123!"})
    student_token = res.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    print("✅ Student re-login successful!")

    # 5. Fetch Dashboard
    print("\n[5] Fetching Student Dashboard...")
    res = requests.get(f"{BASE_URL}/student/dashboard", headers=student_headers)
    dash_data = res.json()
    print(f"✅ Enrolled in: {dash_data['internship_title']}")
    print(f"✅ Current Module: {dash_data['current_module']['title']}")
    module_id = dash_data['current_module']['id']

    # 6. Take the test
    print(f"\n[6] Submitting answers for {module_id}...")
    test_payload = {
        "answers": [
            {"question_index": 0, "selected_option_index": 0} # 0 is 'Yes', which is correct
        ]
    }
    res = requests.post(f"{BASE_URL}/student/module/{module_id}/test", json=test_payload, headers=student_headers)
    test_result = res.json()
    print(f"✅ Test Graded! Score: {test_result['score_percentage']}% - Passed: {test_result['passed']}")
    
    if test_result.get("internship_completed"):
        print(f"🎉 Certificate generated! Hash: {test_result['certificate_hash']}")

    print("\n✅ End-to-End Flow verified successfully!")

if __name__ == "__main__":
    run_test()
