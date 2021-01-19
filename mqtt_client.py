#!/usr/bin/env python3

import paho.mqtt.client as mqtt
import ast
import pickle


pickle_file = 'sensor.pickle'

def save_pickle(data,filename):
  with open(filename,'wb') as f:
    pickle.dump(data,f)

def load_pickle(filename):
  with open(filename,'rb') as f:
    data=pickle.load(f)
    return data


# This is the Subscriber

def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  client.subscribe("#")

def on_message(client, userdata, msg):
  byte_str = msg.payload
  data = ast.literal_eval(byte_str.decode("UTF-8"))
  #print(data)
  #print( f"{data['euler'][0]}", end='\r')
  save_pickle(data,pickle_file)
  try:  
    print( f"{data.get('euler')[0]}", end='\r')
  except:
    print('No data available')

  #client.disconnect()
    
client = mqtt.Client()
client.connect("192.168.1.191",1883,60)

client.on_connect = on_connect
client.on_message = on_message

print('\n\n')
client.loop_forever()
print('done')