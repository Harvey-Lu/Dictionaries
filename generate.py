'''
    Module
'''
import DictGenerator as Dict

def generate_dict(name):
    """
        Generate a dictionary
    """
    dictionary = name("Oxford")
    dictionary.generate()


if __name__ == "__main__":
    generate_dict(Dict.OxfordGenerator)
