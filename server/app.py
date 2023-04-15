from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX
from pmdarima import auto_arima
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse 
from flask_pymongo import pymongo
from sklearn import metrics
app = Flask(__name__)
CORS(app)



mongoDB_url="mongodb+srv://surya:surya@cluster0.ibgirv6.mongodb.net/?retryWrites=true&w=majority"
mongoDB=pymongo.MongoClient(mongoDB_url)
db=mongoDB['mongodb']
login=db.mongocollection
app = Flask(__name__)
CORS(app)




@app.route('/login',methods=['POST'])
def valid_login():
        print(request.form['username'])
        if request.method == 'POST':
            
            username= request.form['username']
            password =request.form['password']
            print(password)
            for users in login.find():
                 if(users['username'] == username  and users['password']== password):
                      print(users['username'])
                      return jsonify("valid login")
                 elif(users['username'] == username and users['password']!= password):
                      return jsonify("Password is incorrect")
            return jsonify("Invalid credentials. Please check your username and password.")
	
@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():

	# Read the AirPassengers dataset
	global data
	global mse,rmse_val,mae,mape
	if request.method=='POST':
		periodicity=request.form['periodicity']
		number=request.form['number']
		file=request.files['file']
		bus = pd.read_csv(file)
		bus.isnull().sum()
		bus.drop(145,axis=0,inplace=True)
		bus.drop(144,axis=0,inplace=True)
		bus['Month']=pd.to_datetime(bus['Month'])
		bus.set_index('Month',inplace=True)	

	# Print the first five rows of the dataset
		# bus.head()

	# ETS Decomposition
		result = seasonal_decompose(bus['BusPassenger'],
								model ='multiplicative')

	# ETS plot
		
		stepwise_fit = auto_arima(bus['BusPassenger'], start_p = 1, start_q = 1,
							max_p = 3, max_q = 3, m = 12,
							start_P = 0, seasonal = True,
							d = None, D = 1, trace = True,
							error_action ='ignore', # we don't want to know if an order does not work
							suppress_warnings = True, # we don't want convergence warnings
							stepwise = True)		 # set to stepwise

	# To print the summary
		stepwise_fit.summary()
		# Split data into train / test sets
		train = bus.iloc[:len(bus)-12]
		test = bus.iloc[len(bus)-12:] # set one year(12 months) for testing
		
	# Fit a SARIMAX(0, 1, 1)x(2, 1, 1, 12) on the training set
		

		model = SARIMAX(train['BusPassenger'],
					order = (0, 1, 1),
					seasonal_order =(2, 1, 0, 12))

		result = model.fit()
		result.summary()
		start = len(train)
		end = len(train) + len(test) - 1

	# Predictions for one-year against the test set
		predictions = result.predict(start, end,typ = 'levels').rename("Predictions")

	# plot predictions and actual values
		predictions.plot(legend = True,title="Actual Vs Predicition",x="month",y="Passengers")
		test['BusPassenger'].plot(legend = True)
		strFile1 = "F:/SalesForecasting/salesForecast/src/assets/img/forecastresult_1.png"
		if os.path.isfile(strFile1):
			os.remove(strFile1)   
		plt.savefig(strFile1)
		plt.clf()
		plt.cla()
		plt.close()
		# Calculate root mean squared error
		rmse_val=rmse(test["BusPassenger"], predictions)

	# Calculate mean squared error
		mse=mean_squared_error(test["BusPassenger"], predictions)
		mae=metrics.mean_absolute_error(test["BusPassenger"] ,predictions)
		mape=metrics.mean_absolute_percentage_error(test["BusPassenger"],predictions)
		mape=round(mape*100, 2)
		
		data={'rmse':rmse_val,'mse':mse,'mae':mae,'mape':mape}
		# Train the model on the full dataset
		model  = SARIMAX(bus['BusPassenger'],
				
							order = (0, 1, 1),
							seasonal_order =(2, 1, 1, 12))
		result = model.fit()

	# Forecast for the next 3 years
		x=12
		
		if(periodicity=="weekly"):
			x=0.25
		elif (periodicity=="monthly"):
			x=1
		
		forecast = result.predict(start = len(bus)-1,
							end = (len(bus)-1) +int(int( number)* x) ,
							typ = 'levels').rename('Forecast')

	
		test['BusPassenger'].plot(figsize = (12, 5), legend = True)
		

		forecast.plot(legend = True,title="Forecasted Result",markersize=15)
			#save
		strFile2 = "F:/SalesForecasting/salesForecast/src/assets/img/forecastresult_2.png"
		if os.path.isfile(strFile2):
			os.remove(strFile2)
		plt.savefig(strFile2)
		plt.clf()
		plt.cla()
		plt.close()
		forecast.to_csv('F:/SalesForecasting/salesForecast/src/assets/result/forecast.csv',index_label='Date')	

	return jsonify(data)
		
if __name__=="__main__":
	app.run(debug=True)