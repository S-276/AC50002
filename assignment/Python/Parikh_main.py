import os


def read_input_file(filename):
    """Reads names from input file, skips empty or invalid lines
    
    Args:
        filename (str): Name of the input file
        
    Returns:
        list: List of Valid names.
        
    """
    names = []
    with open(filename, 'r') as file: #The 'r' stands for only reading the filename
        for line in file:
            name = line.strip() #This will remove all the empty spaces in the file
            if name  and len(name.replace(" "," ")) >= 3 : #Atleast 3 valid characters
                names.append(name)
    return names

def load_letter_values(filename):
    """Loads letter rarity values from values.txt file.
    
    Args:
        filename(str): Name of the values file
        
    Return:
        dict: Dictionary of letter scores
    """
    letter_values = {}
    with open(filename, 'r') as file: 
        for line in file:
            letter,score = line.split()
            letter_values[letter] = int(score)
    return letter_values

def generate_abbreviations(name,values):
    """Generates all valid 3-letter abbreviations for a name.
    
    Args:
        name(str): Name to abbreviate
        values(dict): Letter score dictionary
        
    Returns:
        list: List of all abbreviations with the lowest score
    """
    words = [word.upper() for word in name.split() if word.isaplha()] #Removes the extra special characters and converts the words into Uppercases
    if len(words) < 1 or all(len(word)< 3 for word in words):
        return [] #No valid abbreviations for this name
    
    abbreviations = []
    for word in words:
        if len(word) >= 3:
            for i in range(1, len(word)):
                for j in range(i + 1, len(word)):
                    abbr = word[0] + word[i] + word[j]
                    score = calculate_score([word[0],word[i],word[j],values])
                    abbreviations.append((abbr,score))
    
    #Select the abbrevation(s) with the lowest(best) score.

    if abbreviations:
        min_score = min(score for _, score in abbreviations) # Generator Expression 
        #The underscore (_) is used as a placeholder for the first element in the tuple (the abbreviation itself), since it's not needed for the calculation.It is efficient for large datasets. 
        best_abbrevations = [abbr for abbr,score in abbreviations if score == min_score] 
        return best_abbrevations
        
    return []

def process_name(names, values): 
    """Processes a list of names to generate uniue abbrevations.
    
    Args:
        names(list): List of names
        values(dict): Letter score dictionary
    
    Returns:
        dict: Dictionary mapping names to their best abbreviation(s)
    """
    abbreviation_result = {}
    all_abbreviations = {}
    for name in names:
        abbreviations = generate_abbreviations(name,values)
        abbreviation_result[name] = abbreviations
        for abbr in abbreviations:
            if abbr not in all_abbreviations:
                all_abbreviations[abbr] = name #Checks if the name is unique
            else:
                all_abbreviations[abbr] = None # Mark as duplicate  
    
    #Removes Duplicate Abbreviations
    
    final_result = {}
    for name,abbreviations in abbreviation_result.items():
        valid_abbreviations = [abbr for abbr in abbreviations if all_abbreviations.get(abbr) == name] #Checks if the abbreviation is not used for another word(s)
        final_result[name] = valid_abbreviations
    
    return final_result

def calculate_score(letters,values):
    """Calculates the score for a 3-letter abbreviation based on the postion and rarity.
    

    Args:
        letters(list): Letters in the abbreviation
        values(dict): Letter score dictionary
        
    Returns:
        int: Total score for the abbreviations
    """

    total_score = 0
    for idx, letter in enumerate(letters):
        if letter not in values:
            continue #Ignore Unexpected Characters

        if idx == 0:#First letter of abbreviation.
            score = 0
        elif idx == len(letters) - 1: #Last letter
            score == 20 if letter == 'E' else 5
        else:
            score = values[letter]
        
        total_score += score
    return total_score

def get_output_filename(input_file):
    """Generates the output file name based on the input file name.

       
    Args:
        input_file(str): Name of the input file.
        
    Returns:
        str: Name of the output file.
    """
    base_name = os.path.splitext(input_file)[0]
    surname = "Parikh" 
    return f"{surname}_{base_name}_abbreviations.txt"

def write_output_file(output_file,abbreviations):
    """Writes the abbreviaitons to the output file.
    
    Args:
        output_file(str): Name of the output file.
        abbreviations(dict): Dictionary of names and their abbreviations.
    """

    with open(output_file, 'w') as file: #The 'w' stands for only writing the file
        for name, abbr_list in abbreviations.items():
            file.write(name + "\n")
            if abbr_list:
                file.write(" ".join(abbr_list) + "\n")
            else:
                file.write("No valid abbeviations\n")

def main():
    """
    Main function to orchestrate the program. Handles user input, processes names,
    and generates abbreviations.
    """
    # Prompt user for input file
    input_file = input("Enter the name of the input file (e.g., trees.txt): ")
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found.")
        return
    
    # Read names from input file
    names = read_input_file(input_file)
    if not names:
        print("Error: The input file is empty or contains no valid names.")
        return
    
    # Load letter values from 'values.txt'
    values = load_letter_values("values.txt")
    
    # Process names to generate abbreviations
    abbreviations = process_name(names, values)
    
    # Get the output file name
    output_file = get_output_filename(input_file)
    
    # Ensure the directory for the output file exists
    output_dir = os.path.dirname(output_file)
    if not os.path.exists(output_dir) and output_dir != "":
        os.makedirs(output_dir)  # Create the directory if it doesn't exist
    
    # Write the abbreviations to the output file
    write_output_file(output_file, abbreviations)
    print(f"Abbreviations saved to '{output_file}'.")
