'''
    Module
'''
import DictGenerator as Dict

def generate_dict(dict, name):
    """
        Generate a dictionary
    """
    dictionary = dict(name)
    dictionary.generate()


if __name__ == "__main__":
    generate_dict(Dict.OxfordGenerator, 'Oxford')
    generate_dict(Dict.OxfordLawGenerator, 'Oxford Law')
