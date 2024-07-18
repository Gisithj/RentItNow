import json
import pandas as pd
# Revised data format for 8 tools
tools_data = [
    {
        "Item Name": "Cordless Drill",
        "Category": "Woodworking",
        "Brief Description": "High-performance cordless drill suitable for all woodworking tasks.",
        "Item Overview": "This cordless drill provides high torque and variable speed for precise control. It is lightweight, easy to handle, and comes with a rechargeable battery.",
        "Rent per hour": 5,
        "Rent per day": 20,
        "Rent per week": 100,
        "Rent per month": 300,
        "Features": json.dumps({
            "Battery Life": "Long-lasting battery with up to 8 hours of usage",
            "Weight": "Lightweight design at just 2.5 lbs",
            "Speed Settings": "Variable speed control with up to 1500 RPM",
            "Torque": "High torque output of 40 Nm",
            "Chuck Size": "1/2 inch keyless chuck",
            "Ergonomic Design": "Comfortable grip for prolonged use",
            "Battery Type": "Lithium-ion battery",
            "Charge Time": "Quick charge time of 1 hour",
            "Accessories": "Comes with a set of drill bits",
            "Warranty": "2-year manufacturer warranty"
        })
    },
    {
        "Item Name": "Electric Chainsaw",
        "Category": "Gardening",
        "Brief Description": "Powerful electric chainsaw for all your cutting needs.",
        "Item Overview": "The electric chainsaw is equipped with a robust motor for effective cutting. It has an automatic oiling system and a safety brake for user protection.",
        "Rent per hour": 8,
        "Rent per day": 35,
        "Rent per week": 150,
        "Rent per month": 450,
        "Features": json.dumps({
            "Power": "1800W motor",
            "Bar Length": "16 inch bar",
            "Chain Speed": "14 m/s",
            "Weight": "Lightweight at 5.5 kg",
            "Safety": "Automatic chain brake",
            "Oil System": "Automatic oiling system",
            "Ergonomics": "Comfortable handle design",
            "Noise Level": "Low noise operation",
            "Cable Length": "5 meters",
            "Warranty": "2-year warranty"
        })
    },
    {
        "Item Name": "Impact Wrench",
        "Category": "Automotive",
        "Brief Description": "Heavy-duty impact wrench for automotive applications.",
        "Item Overview": "This impact wrench delivers high torque and precision for tough automotive jobs. It is designed for both professional mechanics and DIY enthusiasts.",
        "Rent per hour": 10,
        "Rent per day": 40,
        "Rent per week": 180,
        "Rent per month": 500,
        "Features": json.dumps({
            "Torque": "Maximum torque of 700 Nm",
            "Weight": "4 kg",
            "Speed": "Up to 3200 RPM",
            "Power Source": "Corded electric",
            "Grip": "Ergonomic handle",
            "Durability": "Impact-resistant casing",
            "Noise Level": "Low noise",
            "Accessories": "Includes socket set",
            "Cable Length": "3 meters",
            "Warranty": "2-year warranty"
        })
    },
    {
        "Item Name": "Tile Cutter",
        "Category": "Construction",
        "Brief Description": "Efficient tile cutter for precise cutting of ceramic tiles.",
        "Item Overview": "The tile cutter ensures smooth and precise cuts with minimal effort. It is ideal for both professional and home use.",
        "Rent per hour": 6,
        "Rent per day": 25,
        "Rent per week": 110,
        "Rent per month": 320,
        "Features": json.dumps({
            "Blade Size": "8 inch diamond blade",
            "Cutting Capacity": "Cuts tiles up to 600 mm",
            "Weight": "12 kg",
            "Power": "1000W motor",
            "Water System": "Integrated water cooling",
            "Portability": "Foldable design",
            "Safety": "Safety guard",
            "Precision": "Laser guide",
            "Durability": "Sturdy steel frame",
            "Warranty": "1-year warranty"
        })
    },
    {
        "Item Name": "Rotary Hammer",
        "Category": "Construction",
        "Brief Description": "High-powered rotary hammer for drilling and chiseling.",
        "Item Overview": "This rotary hammer is perfect for heavy-duty drilling and chiseling tasks in concrete, masonry, and other tough materials.",
        "Rent per hour": 12,
        "Rent per day": 50,
        "Rent per week": 200,
        "Rent per month": 600,
        "Features": json.dumps({
            "Power": "1500W motor",
            "Impact Energy": "5 Joules",
            "Weight": "6 kg",
            "Speed": "Up to 900 RPM",
            "Modes": "3 modes - drilling, hammer drilling, chiseling",
            "Grip": "Anti-vibration handle",
            "Durability": "Heavy-duty construction",
            "Accessories": "Includes drill bits and chisels",
            "Cable Length": "4 meters",
            "Warranty": "2-year warranty"
        })
    },
    {
        "Item Name": "Angle Grinder",
        "Category": "Woodworking",
        "Brief Description": "Versatile angle grinder for cutting and grinding tasks.",
        "Item Overview": "The angle grinder is ideal for cutting, grinding, and polishing different materials, providing excellent performance and durability.",
        "Rent per hour": 7,
        "Rent per day": 30,
        "Rent per week": 130,
        "Rent per month": 390,
        "Features": json.dumps({
            "Power": "800W motor",
            "Disc Size": "4.5 inch",
            "Speed": "Up to 11000 RPM",
            "Weight": "2.2 kg",
            "Safety": "Spindle lock for easy disc changes",
            "Handle": "Side handle for better control",
            "Durability": "Dust-sealed switch",
            "Accessories": "Includes grinding and cutting discs",
            "Cable Length": "2.5 meters",
            "Warranty": "1-year warranty"
        })
    },
    {
        "Item Name": "Electric Sander",
        "Category": "Woodworking",
        "Brief Description": "Smooth finish electric sander for wood surfaces.",
        "Item Overview": "This electric sander provides a smooth and even finish for wooden surfaces, making it ideal for furniture and cabinetry work.",
        "Rent per hour": 5,
        "Rent per day": 20,
        "Rent per week": 90,
        "Rent per month": 250,
        "Features": json.dumps({
            "Power": "300W motor",
            "Speed": "Variable speed up to 12000 OPM",
            "Weight": "1.8 kg",
            "Dust Collection": "Built-in dust bag",
            "Grip": "Ergonomic design",
            "Sanding Pad": "5 inch hook and loop pad",
            "Durability": "High-quality construction",
            "Noise Level": "Low noise operation",
            "Accessories": "Includes sanding pads",
            "Warranty": "1-year warranty"
        })
    },
    {
        "Item Name": "Cordless Leaf Blower",
        "Category": "Gardening",
        "Brief Description": "Powerful cordless leaf blower for outdoor cleanup.",
        "Item Overview": "The cordless leaf blower offers high airspeed and volume to clear leaves and debris efficiently, making yard maintenance quick and easy.",
        "Rent per hour": 6,
        "Rent per day": 25,
        "Rent per week": 110,
        "Rent per month": 300,
        "Features": json.dumps({
            "Battery Life": "Up to 45 minutes on a single charge",
            "Weight": "2.5 kg",
            "Airspeed": "Up to 120 MPH",
            "Volume": "400 CFM",
            "Noise Level": "Low noise operation",
            "Speed Settings": "Variable speed control",
            "Battery Type": "Lithium-ion battery",
            "Charge Time": "1 hour quick charge",
            "Ergonomics": "Comfortable grip handle",
            "Warranty": "1-year warranty"
        })
    }
]
# Create DataFrame to hold tool details
tool_listings = []

for tool in tools_data:
    base_info = {
        "Item Name": tool["Item Name"],
        "Category": tool["Category"],
        "Brief Description": tool["Brief Description"],
        "Item Overview": tool["Item Overview"],
        "Rent per hour": tool["Rent per hour"],
        "Rent per day": tool["Rent per day"],
        "Rent per week": tool["Rent per week"],
        "Rent per month": tool["Rent per month"],
        "Features": json.loads(tool["Features"])
    }
    tool_listings.append(base_info) 

# Convert the list of tool listings into a DataFrame
df = pd.DataFrame(tool_listings)

# Save the DataFrame to an Excel file
file_path = "./power_tools_listings.xlsx"
df.to_excel(file_path, index=False)

