# -*- coding: utf-8 -*-
"""
Created on Mon Dec 11 00:12:03 2017

@author: hp
"""

# -*- coding: utf-8 -*-
"""
Created on Sun Dec 10 23:05:51 2017

@author: hp
"""


## Importing the standard packages for a basic python file
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import json
import sys

## Reading data sent from the node file
dataset = pd.read_csv(sys.argv[1])
X = dataset.iloc[:, [1,2,3,4,5,6]].values
y = dataset.iloc[:, 7].values

## Splitting data to train set and test set
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20, random_state = 0)

W = np.mat(sys.argv[2])
W = W.reshape(1,6)
## Feature scaling
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train = sc.fit_transform(X_train.astype(float))
X_test = sc.transform(X_test.astype(float))
W = sc.transform(W.astype(float))
## Importing all classifier libraries
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

## An object that has all 7 classifiers
classifiers = { 'LogisticRegression':LogisticRegression(random_state = 0),
              'KNeighbors': KNeighborsClassifier(n_neighbors = 5, metric = 'minkowski', p = 2),
               'SVC(linear)': SVC(kernel = 'linear', random_state = 0),
               'SVC(rbf)': SVC(kernel = 'rbf', random_state = 0),
              'Gaussian': GaussianNB(),
               'Decision Tree':DecisionTreeClassifier(criterion = 'entropy', random_state = 0),
               'Random Forest':RandomForestClassifier(n_estimators = 10, criterion = 'entropy', random_state = 0)
             }

## Length of classifiers object
n_classifiers = len(classifiers)

## Container variables
data = [ ]
answers = [ ]
count = 0
i=0

a = np.array(y_test)
b = a.ravel()

for index, (name, classifier) in enumerate(classifiers.items()):
     classifier.fit(X_train, y_train)
     y_pred = classifier.predict(X_test)
     
     #print index
     #answers.append(classifier.predict(W))
     from sklearn.metrics import confusion_matrix
     cm = confusion_matrix(y_test, y_pred)
     falseReport=cm[0][1]+cm[1][0]
     trueReport=cm[1][1]+cm[0][0]
     accuracy = float((trueReport)/(falseReport+trueReport))
     obj={
             'name':name,
             'accuracy':accuracy,
             'prediction': np.asscalar(classifier.predict(W))
             
        }
     data.append(obj)

 ## Plotting classification results to get some intuition
     
## End of for loop

## Dumping to a json file
with open('output', 'w') as outfile:
    json.dump(data, outfile)
print(data)
sys.stdout.flush()    