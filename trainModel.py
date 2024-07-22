import os
import subprocess

base_directory = "./images"

# iterate over sub-directories which are the --lang parameter also
for sub_directory in os.listdir(base_directory):
    sub_directory_path = os.path.join(base_directory, sub_directory)
    
   
    if os.path.isdir(sub_directory_path):
        print(f"Processing images in directory: {sub_directory}")
        
        # Iterating over teh  images in the each fiolder
        for image_file in os.listdir(sub_directory_path):
            image_path = os.path.join(sub_directory_path, image_file)
            
            # Check if the item is a file
            if os.path.isfile(image_path):
                print(f"Executing node app with image: {image_path}")
                
                # Executing teh node command to get output for image
                command = ["node", "app.js", "run", f"--imageUrl={image_path}","--stdin=\'\'",f"--lang={sub_directory}"]
                print(command)
                process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                output, error = process.communicate()
                
                # Check if there was any error during execution
                if process.returncode != 0:
                    print("Error executing the command:")
                    print(error.decode())
                else:
                    print("Command executed successfully.")
                    print("Output:")
                    print(output.decode())
