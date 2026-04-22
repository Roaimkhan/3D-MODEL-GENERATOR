import os
from fastapi import FastAPI
from dotenv import load_dotenv
import requests
from pprint import pprint

app = FastAPI()
load_dotenv()

MESHY_API = os.getenv("MESHY_API")
headers = {
  "Authorization": f"Bearer {MESHY_API}"
}


#Qasim make this function an endpoint to start generating the 3d model using fastapi. It returns "TASK ID"
def start_preview_task(prompt:str):
    payload = {
    "mode": "preview",
    "prompt": f"{prompt}",
    }

    response = requests.post(
    "https://api.meshy.ai/openapi/v2/text-to-3d",
    headers=headers,
    json=payload,
    )
    response.raise_for_status()
    response.json()
    return response["result"]


#Qasim make this function an endpoint to get the generated model using TASK ID which u got from "def start_preview_task". 
def get_preview_task(task_id:str):
    response = requests.get(
        f"https://api.meshy.ai/openapi/v2/text-to-3d/{task_id}",
        headers=headers,
    )
    response.raise_for_status()
    return response.json()

#THE ABOVE FUNCTION "def get_preview_task" returns a json dictionary which contains a field "status". When the ai is busy generating the model. The status will be "IN_PROGRESS". U have to repeated call this endpoint (this concept is called "polling") untill the status field changes to "SUCCEEDED". It means the ai has completed the model generation ! now u can get the generated model model using a field from the dictionary called "model_urls".the model url looks like :
# 'model_urls': {'fbx': 'http....',
    #             'glb': 'http....',
    #             'obj': 'http....',
    #             'stl': 'http....',
    #             'usdz': 'http....'
    # }
#those urls will download the file ... then display those files in react!


