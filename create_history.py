import pickle
import json
from random import randrange

history = [randrange(180,190) for i in range(1000)]



data = {'requested':180,'history':history}

with open('headings.pickle','wb') as f:
  pickle.dump(data,f)


print('done')