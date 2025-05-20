import json
import re
import subprocess
import sys
import argparse
from collections import defaultdict

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="Fix TypeScript import errors")
    parser.add_argument("--dry-run", action="store_true", 
                      help="Show changes without modifying files")
    return parser.parse_args()

def get_tsc_errors():
    """Run tsc and get the errors as structured data"""
    try:
        # Use a command that produces more structured output
        result = subprocess.run(['npx', 'tsc', '--noEmit', '--pretty', 'false'], 
                                capture_output=True, 
                                text=True,
                                check=False)
        
        output = result.stdout + result.stderr
        print(output)
        
        errors = []
        
        # Parse TS1484 errors (type-only imports)
        type_error_pattern = r"^(.+\.ts[x]?)\((\d+),(\d+)\): error TS1484: '(.+)' is a type and must be imported using a type-only import"
        
        for match in re.finditer(type_error_pattern, output, re.MULTILINE):
            file_path, line, column, type_name = match.groups()
                
            errors.append({
                'file_path': file_path,
                'line': int(line),
                'column': int(column),
                'type_name': type_name,
                'error_code': 1484
            })
        
        # Parse TS2835 errors (file extension required)
        extension_error_pattern = r"^(.+\.ts[x]?)\((\d+),(\d+)\): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports.+Did you mean '(.+)'?"
        
        for match in re.finditer(extension_error_pattern, output, re.MULTILINE):
            file_path, line, column, suggested_path = match.groups()
                
            errors.append({
                'file_path': file_path,
                'line': int(line),
                'column': int(column),
                'suggested_path': suggested_path,
                'error_code': 2835
            })
        
        return errors
    except Exception as e:
        print(f"Error running tsc: {e}")
        return []

def fix_files(errors, dry_run=False):
    """Fix the files by modifying imports"""
    # Group errors by file to avoid multiple reads/writes
    file_groups = defaultdict(list)
    for error in errors:
        file_groups[error['file_path']].append(error)
    
    if not file_groups:
        print("No errors found!")
        return 0
    
    print(f"Found {len(errors)} errors to fix in {len(file_groups)} files")
    
    total_fixed = 0
    
    # Process each file
    for file_path, file_errors in file_groups.items():
        print(f"\nProcessing {file_path}...")
        
        try:
            # Read the file
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Track which lines we've modified
            modified_lines = set()
            
            # Fix each error
            for error in file_errors:
                line_index = error['line'] - 1  # Convert to 0-based index
                
                # Skip if already modified
                if line_index in modified_lines:
                    continue
                
                line = lines[line_index]
                
                # Handle different error types
                if error.get('error_code') == 1484:
                    # Fix type-only imports (TS1484)
                    type_name = error['type_name']
                    
                    # Check if this is an import statement
                    if 'import {' in line and '} from' in line:
                        # Extract the imports
                        import_match = re.search(r'import\s+\{([^}]+)\}\s+from', line)
                        if import_match:
                            imports = [imp.strip() for imp in import_match.group(1).split(',')]
                            
                            # Update imports by adding 'type' before the problematic type
                            updated_imports = []
                            for imp in imports:
                                # Check if this import is for the type we need to fix
                                # Either exact match or "X as TypeName"
                                if imp == type_name or re.search(rf'\w+\s+as\s+{re.escape(type_name)}$', imp):
                                    if not imp.startswith('type '):
                                        imp = f"type {imp}"
                                updated_imports.append(imp)
                            
                            # Reconstruct the import statement
                            new_line = line.replace(import_match.group(1), ", ".join(updated_imports))
                            lines[line_index] = new_line
                            modified_lines.add(line_index)
                            
                            print(f"  Before: {line.strip()}")
                            print(f"  After:  {new_line.strip()}\n")
                            total_fixed += 1
                
                elif error.get('error_code') == 2835:
                    # Fix missing file extensions (TS2835)
                    suggested_path = error['suggested_path']
                    
                    # Find the import statement and replace the path
                    import_pattern = r"from\s+['\"]([^'\"]+)['\"]"
                    import_match = re.search(import_pattern, line)
                    
                    if import_match:
                        old_path = import_match.group(1)
                        new_line = line.replace(f"'{old_path}'", f"'{suggested_path}'")
                        new_line = new_line.replace(f'"{old_path}"', f'"{suggested_path}"')
                        
                        lines[line_index] = new_line
                        modified_lines.add(line_index)
                        
                        print(f"  Before: {line.strip()}")
                        print(f"  After:  {new_line.strip()}")
                        total_fixed += 1
            
            # Write the file back if we made changes
            if modified_lines:
                if dry_run:
                    print(f"✓ Would fix {len(modified_lines)} import statements in {file_path} (dry run)")
                else:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.writelines(lines)
                    print(f"✓ Fixed {len(modified_lines)} import statements in {file_path}")
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    
    return total_fixed

def main():
    args = parse_args()
    
    if args.dry_run:
        print("Running in dry-run mode - no files will be modified")
    
    print("Running TypeScript compiler to get errors...")
    errors = get_tsc_errors()
    print(errors)
    
    if not errors:
        print("No errors found or couldn't parse TypeScript output!")
        return
    
    # Fix the errors
    total_fixed = fix_files(errors, dry_run=args.dry_run)
    
    if args.dry_run:
        print(f"\nDone! Would fix {total_fixed} import statements (dry run)")
    else:
        print(f"\nDone! Fixed {total_fixed} import statements.")

if __name__ == "__main__":
    main()