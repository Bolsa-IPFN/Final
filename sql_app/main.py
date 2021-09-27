import os
import sys
import uvicorn

from typing import List

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

home_dir = os.path.dirname(__file__)
modules_dir = os.path.join(home_dir, 'sql_app')
sys.path.append(modules_dir)

from database import SessionLocal, engine
import crud
import models
import json
import schemas
import threading
from Serial_Read_Temp import check_Arduino_is_connected,receive_data_from_exp,temperaturelist_data,action_valv, temperature_all_data



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://127.0.0.1",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FORMAT='utf-8'


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# @app.post("/users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return crud.create_user(db=db, user=user)


# @app.get("/users/", response_model=List[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users


# @app.get("/users/{user_id}", response_model=schemas.User)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user


# @app.post("/users/{user_id}/items/", response_model=schemas.Item)
# def create_item_for_user(
#     user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
# ):
#     return crud.create_user_item(db=db, item=item, user_id=user_id)


# @app.get("/items/", response_model=List[schemas.Item])
# def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     items = crud.get_items(db, skip=skip, limit=limit)
#     return items


@app.get("/temperature_all",  response_model=List[schemas.Temperature])
def get_all_temperature(db: Session = Depends(get_db)):
    all_data = temperature_all_data(db)
    return list(all_data)


@app.get("/temperature_list/{limit}",  response_model=List[schemas.Temperature])
def get_temp_list(limit: int, db: Session = Depends(get_db)):
    items = temperaturelist_data(db, limit=limit)
    for item in items:
        
        print('montecarlo get_point_list item : ', type(item.value), item.value) 

    print('montecarlo get_point_list type : ', type(item), type(schemas.Temperature))    
    return list(items)

#_______________ isto ______________________

@app.post('/action_experiment')
async def Action_on_Experiment(request: Request):
    user_json = await request.json()
    print(json.dumps(user_json, indent=4))
    action_valv(user_json['experiment_action'])
    return ''
    

#_________________________________________________________________________

# @app.route('/action_experiment',  methods=['POST','OPTIONS'])
# def Action_on_Experiment():
#     if request.method == 'POST':
#         #origin = request.headers.get('Origin')	
#         print(request.data)
        
#         user_json = json.loads(request.data.decode(FORMAT))
#         ConfigureActionExperiment(user_json)
        
#             # ConfigureActionExperiment(request.data)
#         return '' #jsonify({'JSON Enviado' : request.args.get('JSON'), 'result': 'OK!'})
#     elif request.method == 'OPTIONS':
#         return ''


if __name__ == "__main__":
    print('Load Main Stuff')
    print('Encrypted : ', crud.passwd_encypt('Test'))
    check_Arduino_is_connected()
    # db: Session = Depends(get_db)
    db_local = None
    while True:
        try:
            db_local = SessionLocal()
            break
        except:
            print("Data base not found")
            pass
    data_thread = threading.Thread(target=receive_data_from_exp,args=(db_local,),daemon=True)
    data_thread.start()
    # https://www.uvicorn.org/settings/
    # https://fastapi.tiangolo.com/advanced/websockets/
    # uvicorn.run("main:app", host='127.0.0.1', port=8001, workers=4, access_log=False)  
    uvicorn.run("main:app", host='127.0.0.1', port=8001)  