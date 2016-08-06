'''
    DictGenerator Class. Generate a js file from a txt dictionary.
'''

import abc

def lremove(string, prefix):
    '''
        Remove the prefix
    '''
    if string.startswith(prefix):
        return string[len(prefix) :]
    return string

def rremove(string, suffix):
    '''
        Remove the suffix
    '''
    if string.endswith(suffix):
        return string[: -len(suffix)]
    return string

def remove(string, prefix, suffix=None):
    '''
        Remove the prefix and the suffix
    '''
    if suffix is None:
        suffix = prefix
    if string.startswith(prefix):
        string = string[len(prefix):]
    if string.endswith(suffix):
        string = string[: -len(suffix)]
    return string

class DictGeneratorBase(metaclass=abc.ABCMeta):
    '''
    DictGenerator Base Class
    '''
    @abc.abstractmethod
    def process_word(self, word):
        '''
            Process each word
        '''
        pass

    @abc.abstractmethod
    def print_before(self):
        '''
            Generate word
        '''
        pass

    @abc.abstractmethod
    def print_after(self):
        '''
            Generate after
        '''
        pass

    @abc.abstractmethod
    def generate(self):
        '''
            Generate
        '''
        pass


class OxfordGenerator(DictGeneratorBase):
    """
        Oxford Generator
    """
    def __init__(self, name):
        self.name = name
        self.output_file = open(self.name + ".js", "w", encoding="UTF-8")
        self.input_file = open(self.name + ".txt", "r", encoding="UTF-8")

    def generate(self):
        self.print_before()
        for line in self.input_file:
            self.process_word(line)
        self.print_after()
        self.output_file.close()
        self.input_file.close()

    def process_word(self, word):
        [word, html] = word.split('\t')
        raw_entries = remove(html, '<C><F><I><N>', '</N></I></F></C>\n')\
        .split('</N></I></F><F><I><N>')

        self.output_file.write('"' + word + '":\n')
        entries = []
        for raw_entry in raw_entries:

            raw_entry = raw_entry.replace(
                '=&gt;',
                '<span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span>'
            )
            # raw_entry = raw_entry.replace('<Y',
            # '<button type="button" class="btn btn-info" source="oxford"')
            # raw_entry = raw_entry.replace('</Y>', '</button>')
            # raw_entry = raw_entry.replace('<l>', '<sup>')
            # raw_entry = raw_entry.replace('</l>', '</sup>')

            br_count = raw_entry.count('<br /', 0, raw_entry.find('#'))
            symbol_index = raw_entry.find('<br />')
            if symbol_index == -1 or br_count == 1:
                symbol = ''
                raw_meaning = raw_entry
            else:
                symbol = raw_entry[0 : symbol_index]
                raw_meaning = raw_entry[symbol_index + 6:]
            derivations = []
            hash_index = raw_meaning.find('#')
            gt_index = raw_meaning.find('&gt;')
            if hash_index != -1 and (gt_index == -1 or hash_index < gt_index):
                meanings = raw_meaning[0 : hash_index]
                derivations = raw_meaning[hash_index + 1 :].strip().split('<br /> ')
            elif gt_index != -1:
                meanings = raw_meaning[0 : gt_index]
                derivations = raw_meaning[gt_index + 4 :].strip().split('<br /> ')
            else:
                meanings = raw_meaning

            meanings = meanings.strip().split('<br /> ')
            if not meanings[-1]:
                meanings.pop()

            entry = [symbol, [meanings, derivations]]
            entries.append(entry)
        self.output_file.write(str(entries) + ',\n')


    def print_before(self):
        # print(self.name + ' = {')
        self.output_file.write(self.name + ' = {\n')

    def print_after(self):
        # print("};")
        self.output_file.write("};\n")

class OxfordLawGenerator(DictGeneratorBase):
    """
        Oxford Generator
    """
    def __init__(self, name):
        self.name = name
        self.output_file = open(self.name + ".js", "w", encoding="UTF-8")
        self.input_file = open(self.name + ".txt", "r", encoding="UTF-8")

    def generate(self):
        self.print_before()
        for line in self.input_file:
            self.process_word(line)
        self.print_after()
        self.output_file.close()
        self.input_file.close()

    def process_word(self, word):
        [word, html] = word.split('\t')
        raw_words = remove(html, '<C>', '</C>\n').split('</C><C>')

        self.output_file.write('"' + word + '":\n')
        words = []
        for raw_word in raw_words:
            word = []
            refer_word = ''
            if raw_word.startswith('<E>'):
                e_index = raw_word.find('</E>')
                refer_word = raw_word[3 : e_index]
                raw_word = raw_word[e_index + 4 :]
            word.append(refer_word)
            raw_entries = remove(raw_word, '<F><I><N>', '</N></I></F>')\
                .split('</N></I></F><F><I><N>')
            seen = set()
            seen_add = seen.add
            raw_entries = [x for x in raw_entries if not (x in seen or seen_add(x))]
            entries = []
            for raw_entry in raw_entries:
                entries.append(raw_entry.split('<br />'))
            word.append(entries)

            words.append(word)
        self.output_file.write(str(words) + ',\n')



    def print_before(self):
        # print(self.name + ' = {')
        self.output_file.write(self.name.replace(' ', '') + ' = {\n')

    def print_after(self):
        # print("};")
        self.output_file.write("};\n")
