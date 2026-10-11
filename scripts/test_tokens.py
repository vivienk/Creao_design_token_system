import unittest
from extract_tokens import build, rgba

class SourceMappingTests(unittest.TestCase):
    def test_alpha_is_retained(self):
        self.assertAlmostEqual(rgba('#f3ecd81a')['a'],26/255)
    def test_theme_cascade_and_alias(self):
        tokens={t['cssName']:t for t in build()['tokens']}
        self.assertEqual(tokens['--color-control-border']['aliases']['Light'],'--color-grey-200')
        self.assertEqual(tokens['--color-background']['raw']['Dark'],'#161615')
        self.assertTrue(tokens['--color-card-hover']['raw']['Dark'].startswith('color-mix('))
        self.assertNotEqual(tokens['--color-card-hover']['values']['Dark'],rgba('#f5f3ef'))
    def test_contextual_auth_theme_does_not_override_app(self):
        data=build(); t={t['cssName']:t for t in data['tokens']}
        self.assertEqual(t['--color-background']['raw']['Light'],'#f8f6f3')
        self.assertTrue(any('auth-legacy-theme' in d['selector'] for d in data['inventory']))
    def test_rem_and_raw_expression(self):
        t={t['cssName']:t for t in build()['tokens']}
        self.assertEqual(t['--spacing']['values']['Light'],4)
        self.assertEqual(t['--radius']['values']['Light'],6)
        self.assertEqual(t['--text-xs--line-height']['values']['Light'],'calc(1 / .75)')

if __name__=='__main__': unittest.main()
