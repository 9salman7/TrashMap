#!/usr/bin/python
import pymongo
import cgi
from geojson import Feature, Point, FeatureCollection

print "Content-type:text/html \r\n\r\n"

form = cgi.FieldStorage()
latitude=float(form["lati"].value) 
longitude=float(form["long"].value) 

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["dbtest"]

my_point= Point((longitude,latitude))
my_feature= Feature(geometry=my_point, properties={"city": "Bangalore"},id=100)

feature_collection=FeatureCollection([my_feature])

#feature_collection["features"].append(my_feature)
#print(feature_collection)
mycol2 = mydb["coltest3"]

#mydict = { "name": "John", "address": "Highway 37" }
#mycol2.delete_many({})

x = mycol2.insert_one(feature_collection)
for x in mycol2.find():
  print(x)

print '<html>'
print '<head>'
print '<title>tEsTiNg</title>'
print '</head>'
print '<body>'
print '<h2>Hello World!</h2>'
print '</body>'
print '</html>'
