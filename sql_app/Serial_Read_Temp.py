from datetime import datetime
import random
import math
import time
import importlib
import json
import threading
import os
import serial

from pydantic import BaseModel


import crud

#______________Arduino_ ler_temp_________________
FORMAT = 'utf-8'
CONFIG_OF_EXP=[]
Exp = 'Arduino_Temp'
serial_port = None
first = 0
port = None
baud = 0
desth_timeout = 0


#_________RPi_Read_&_Write_Serial_on_the Arduino____________


def get_Config(Exp):
    global CONFIG_OF_EXP
    #Apanhar erro se ficheiro no existir
    print ("Estou aqui")
    config = 'Configs/'+str(Exp)+'.json'
    with open(config) as json_file:
        data = json.load(json_file)
    CONFIG_OF_EXP =  data
    if CONFIG_OF_EXP != None:
        return True
    return False

def try_to_lock_experiment(config_json, serial_port):
    #LOG_INFO
    print("AH PROCURA DO PIC NA PORTA SERIE")
    arduino_message = serial_port.read_until(b'\r')
    arduino_message = arduino_message.decode(encoding='ascii')
    arduino_message = arduino_message.strip()
    print("MENSAGEM DO Arduino:\n")
    print(arduino_message)
    print("\-------- --------/\n")
    return True

def check_Arduino_is_connected():
    global CONFIG_OF_EXP
    global serial_port
    val =  get_Config(Exp)
    print (val)
    print("Recebi mensagem de configuracao. A tentar inicializar a experiencia\n")
    
    #LIGAR A DISPOSITIVO EXP - INIT
    #Talvez passar erros em forma de string JSON para incluir no reply em vez de OK e NOT OK
    if 'serial_port' in CONFIG_OF_EXP:
        for exp_port in CONFIG_OF_EXP['serial_port']['ports_restrict']:
            print("A tentar abrir a porta "+exp_port+"\n")
            try:
                #alterar esta função para aceitar mais definições do json
                #é preciso uma função para mapear os valores para as constantes da porta série
                #e.g. - 8 bits de data -> serial.EIGHTBITS; 1 stopbit -> serial.STOPBITS_ONE
                port = exp_port
                baud = int(CONFIG_OF_EXP['serial_port']['baud'])
                desth_timeout = int(CONFIG_OF_EXP['serial_port']['death_timeout'])
                serial_port = serial.Serial(port = exp_port,\
                                                    baudrate=int(CONFIG_OF_EXP['serial_port']['baud']),\
                                                    timeout = int(CONFIG_OF_EXP['serial_port']['death_timeout']))
            except serial.SerialException:
                #LOG_WARNING: couldn't open serial port exp_port. Port doesnt exist or is in use
                pass
            else:
                if try_to_lock_experiment(CONFIG_OF_EXP, serial_port) :
                    break
                else:
                    serial_port.close()
        
        if serial_port.is_open :
            #LOG_INFO : EXPERIMENT FOUND. INITIALIZING EXPERIMENT
            print("Consegui abrir a porta e encontrar a experiencia\n")
            #Mudar para números. Return 0 e mandar status
            return True
        else:
            #SUBSTITUIR POR LOG_ERROR : couldn't find the experiment in any of the configured serial ports
            print("Nao consegui abrir a porta e encontrar a experiencia\n")
            #return -1
            return False
    else:
        #LOG_ERROR - Serial port not configured on json.
        #return -2
        return False

# To open and Close the val 1 to 5 
def action_valv(comand):
    global serial_port
    global port
    global baud
    global desth_timeout
    
    if serial_port.is_open :
        pass
    else:
        serial_port = serial.Serial(port = port,\
                                    baudrate=baud,\
                                    timeout = desth_timeout)
    print(json.dumps(comand,indent=4))
    serial_port.write(b''+json.dumps(comand).encode('utf-8'))
    
    return True


def do_reset_serial_com():
    global serial_port
    if serial_port.is_open :
            serial_port.reset_input_buffer()
            pass
    else:
        serial_port = serial.Serial(port = port,\
                                    baudrate=baud,\
                                    timeout = desth_timeout)
    return ''
    


def receive_data_from_exp(db):
    global serial_port
    while True:
        print("ola")
        if serial_port.is_open == False:
            print("não existe serial")
        else:
            try:
                serial_port.reset_input_buffer()
                Arduino_message = serial_port.readline()    
                Arduino_message = json.loads(Arduino_message)
                dt_string = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                Arduino_message["sample"] = str(dt_string)
                # Arduino_message = json.dumps(Arduino_message)
                # pic_message = pic_message.decode(encoding='ascii')
                print("MENSAGEM DO Arduino:\n")
                print(json.dumps(Arduino_message,indent=4))
                print("\-------- --------/\n")
            except:
                do_reset_serial_com()
                Arduino_message = {'error':'faill to read Serial port trying to rest!'}
                print("Ponto deu erro no JSON!!!")
            
            crud.add_temperature(db, Arduino_message)


def temperaturelist_data(db, limit: int = 1):
    return crud.get_temperature_list(db, limit)