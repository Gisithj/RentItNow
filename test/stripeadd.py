from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import random
import pandas as pd
import ast

# Read the Excel file
excel_path = './power_tools_listings.xlsx'  # Update this path
df = pd.read_excel(excel_path)

# Setup WebDriver (example with Chrome)
options = webdriver.FirefoxOptions()
driver = webdriver.Firefox(options=options)
driver.maximize_window()
# Navigate to the website
driver.get("https://dashboard.stripe.com/test/products")

wait = WebDriverWait(driver, 10)  # Wait for up to 10 seconds
email_field = wait.until(EC.presence_of_element_located((By.ID, "email")))
    # Login (if required)
driver.find_element(By.ID, "email").send_keys("gisithj@gmail.com")
driver.find_element(By.ID, "old-password").send_keys("^t!7iWm2eLe!FEg")
wait = WebDriverWait(driver, 30)
sign_in_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-db-analytics-name='email_password_input_sign_in_button']")))
sign_in_button.click()

wait = WebDriverWait(driver, 30)
sign_in_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-testid='new-product-button']")))
sign_in_button.click()

    # Wait for login to complete
time.sleep(5)  # Adjust time based on your network speed

# for index, row in df.iterrows():
    

#     driver.find_element(By.ID, "sidebar_manage_listings").click()
#     wait = WebDriverWait(driver, 10)  # Wait for up to 10 seconds
#     username_field = wait.until(EC.presence_of_element_located((By.ID, "add_new_listing_button")))
#     driver.find_element(By.ID, "add_new_listing_button").click()
#     time.sleep(3)
#     # Navigate to Add Listing Page
#     # driver.find_element(By.LINK_TEXT, "Add Listing").click()

#     # Fill in Listing Details
#     driver.find_element(By.ID, "item_name").send_keys(row['Item Name'])

#     #select the item category
#     driver.find_element(By.ID, "category").click()
#     driver.find_element(By.ID, f"category_item_{row['Category']}").click()
#     driver.find_element(By.ID, "item_desctiption").send_keys(row['Brief Description'])
#     driver.find_element(By.ID, "item_overview").send_keys(row['Item Overview'])

#     # add rent options
#     wait = WebDriverWait(driver, 5) 
#     rent_option = wait.until(EC.presence_of_element_located((By.ID, "rent_option")))
#     rent_option.click()
#     rent_option_select = wait.until(EC.element_to_be_clickable((By.ID, "rent_option_Rent per hour")))
#     rent_option_select.click()
#     rent_price_input = wait.until(EC.element_to_be_clickable((By.ID, "rent_price")))
#     rent_price_input.send_keys(row["Rent per hour"])
#     time.sleep(1.5)
#     driver.find_element(By.ID, "add_rent_option").click()

#     wait = WebDriverWait(driver, 5) 
#     rent_option = wait.until(EC.presence_of_element_located((By.ID, "rent_option")))
#     rent_option.click()
#     rent_option_select = wait.until(EC.element_to_be_clickable((By.ID, "rent_option_Rent per day")))
#     rent_option_select.click()
#     rent_price_input = wait.until(EC.element_to_be_clickable((By.ID, "rent_price")))
#     rent_price_input.send_keys(row["Rent per day"])
#     time.sleep(1.5)

#     driver.find_element(By.ID, "add_rent_option").click()
#     wait = WebDriverWait(driver, 5) 
#     rent_option = wait.until(EC.presence_of_element_located((By.ID, "rent_option")))
#     rent_option.click()
#     rent_option_select = wait.until(EC.element_to_be_clickable((By.ID, "rent_option_Rent per week")))
#     rent_option_select.click()
#     rent_price_input = wait.until(EC.element_to_be_clickable((By.ID, "rent_price")))
#     rent_price_input.send_keys(row["Rent per week"])
#     time.sleep(1.5)
#     driver.find_element(By.ID, "add_rent_option").click()

#     wait = WebDriverWait(driver, 5) 
#     rent_option = wait.until(EC.presence_of_element_located((By.ID, "rent_option")))
#     rent_option.click()
#     rent_option_select = wait.until(EC.element_to_be_clickable((By.ID, "rent_option_Rent per month")))
#     rent_option_select.click()
#     rent_price_input = wait.until(EC.element_to_be_clickable((By.ID, "rent_price")))
#     rent_price_input.send_keys(row["Rent per month"])
#     time.sleep(1.5)
#     driver.find_element(By.ID, "add_rent_option").click()

#      # add item spec feature
#     features_json = row["Features"]
#     features_dict = ast.literal_eval(features_json)
#     for feature_name, feature_value in features_dict.items():
#         wait.until(EC.presence_of_element_located((By.ID, "feature_name"))).send_keys(feature_name)
#         driver.find_element(By.ID, "feature_value").send_keys(feature_value)
#         driver.find_element(By.ID, "add_feature").click()
#         time.sleep(1)

    # add item spec feature
    # driver.find_element(By.ID, "feature_name").send_keys("feature name 1 testing")
    # driver.find_element(By.ID, "feature_value").send_keys("feature value 1 testing")
    # driver.find_element(By.ID, "add_feature").click()

    # driver.find_element(By.ID, "feature_name").send_keys("feature name 2 testing")
    # driver.find_element(By.ID, "feature_value").send_keys("feature value 2 testing")
    # driver.find_element(By.ID, "add_feature").click()

#     file_input = driver.find_element(By.ID, "file-input")
#     file_path = os.path.join("E:\\", "Downloads", f"OIG3 ({index+1}).jpeg")  
#     print(file_path)
#     wait = WebDriverWait(driver, 10) 
#     file_input.send_keys(file_path)

#     driver.find_element(By.ID, "add_listing").click()
#     time.sleep(5)
#     driver.find_element(By.ID, "return_to_listings_button").click()
#     print(f"{index+1} listing added")
# time.sleep(35)
# Close Browser
# driver.quit()