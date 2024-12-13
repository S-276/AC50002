import itertools
import re
import os

def read_values(filename):
    """Reads letter scores from a file and returns a dictionary."""
    scores = {}
    with open(filename, 'r') as f:
        for line in f:
            letter, score = line.strip().split()
            scores[letter.upper()] = int(score)
    return scores

def process_name(name):
    """Processes a name to remove non-alphabet characters and split into words."""
    words = re.sub(r"[^A-Za-z ]", " ", name).upper().split()
    return words

def improved_generate_abbreviations(name, scores):
    """Advanced abbreviation generation with context-aware strategies."""
    words = process_name(name)
    abbreviations = []

    # Enhanced single-word name handling
    if len(words) == 1:
        word = words[0]
        
        # Return "No valid abbreviation" for words 3 letters or shorter
        if len(word) <= 3:
            return []

        # Prioritize meaningful letter selections
        strategies = [
            # Consonant-heavy abbreviations
            lambda w: [abbr for abbr in [''.join(comb) 
                for comb in itertools.combinations(
                    [c for c in w if c not in 'AEIOU'], 3)
                ] if len(abbr) == 3],
            
            # Balanced consonant-vowel approach
            lambda w: [abbr for abbr in [''.join(comb) 
                for comb in itertools.combinations(w, 3)
                ] if len(abbr) == 3 and 
                   sum(1 for c in abbr if c in 'AEIOU') in [1, 2]]
        ]

        for strategy in strategies:
            context_abbrs = strategy(word)
            if context_abbrs:
                abbreviations.extend(context_abbrs)
                break

    # Multi-word name handling with advanced selection
    else:
        # Generate combinations from first letters of each word
        for combination in itertools.product(
            *[word[:3] for word in words]
        ):
            abbr = ''.join(combination)[:3]
            if len(abbr) == 3:
                abbreviations.append(abbr)

    return list(set(abbreviations))

def calculate_score(abbreviation, scores):
    """Calculates the total score for an abbreviation based on letter positions."""
    total_score = 0
    semantic_bonuses = {
        'E': 20,  # Bonus for final E
        'S': -3,  # Slight bonus for plural indicators
        'R': -2,  # Slight bonus for verb/agent indicators
    }

    for position, letter in enumerate(abbreviation, start= 1):
        if position == 1:
            score = 0  # First letter always free
        elif position == len(abbreviation):
            score = semantic_bonuses.get(letter, 5)  # Last letter special scoring
        else:
            # Progressive difficulty scoring
            pos_score = 1 if position == 2 else (2 if position == 3 else 3)
            score = pos_score + scores.get(letter, 0)

        # Apply semantic bonuses
        score += semantic_bonuses.get(letter, 0)
        total_score += score

    return total_score

def process_names(names, scores):
    """Processes a list of names to generate unique abbreviations."""
    abbreviation_results = {}

    for name in names:
        name = name.strip()
        if not name:
            continue

        abbreviations = improved_generate_abbreviations(name, scores)
        if not abbreviations:
            abbreviation_results[name] = "No valid abbreviation"
            continue

        # Calculate scores for all abbreviations and select the lowest score
        scored_abbreviations = {
            abbr: calculate_score(abbr, scores) for abbr in abbreviations
        }

        if scored_abbreviations:
            best_abbr = min(
                scored_abbreviations, 
                key=lambda abbr: (
                    scored_abbreviations[abbr],  # Primary: lowest score
                    sum(1 for c in abbr if c in 'AEIOU')  # Secondary: vowel balance
                )
            )
            abbreviation_results[name] = best_abbr
        else:
            abbreviation_results[name] = "No valid abbreviation"

    return abbreviation_results

def write_output_file(output_file, abbreviations):
    """Writes the generated abbreviations to an output file."""
    with open(output_file, 'w') as file:
        for name, abbr in abbreviations.items():
            file.write(f"{name}\n{abbr}\n")

def main():
    """Main function to process the input file and write results."""
    surname = "Parikh"
    input_choice = input("Do you want to input names from a file (F) or manually (M)? Please type 'F' or 'M': ").strip().upper()

    if input_choice == 'F':
        input_file = input("Enter the name of the input file (e.g., trees.txt): ").strip()
        with open(input_file, 'r') as infile:
            names = [line.strip() for line in infile]
        output_file = f"{surname}_{os.path.splitext(os.path.basename(input_file))[0]}_abbreviations.txt"
    elif input_choice == 'M':
        names = []
        print("Enter names manually (one per line). Type 'END' to finish.")
        while True:
            name = input("Enter name: ").strip()
            if name.upper() == "END":
                break
            elif name:
                names.append(name)
        output_file = f"{surname}_manual_abbreviations.txt"
    else:
        print("Invalid choice! Please enter 'F' for file input or 'M' for manual input.")
        return

    scores = read_values("values.txt")
    abbreviations = process_names(names, scores)

    write_output_file(output_file, abbreviations)
    print(f"Abbreviations saved to '{output_file}'.")

if __name__ == "__main__":
    main()
