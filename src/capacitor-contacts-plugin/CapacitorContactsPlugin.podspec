
  Pod::Spec.new do |s|
    s.name = 'CapacitorContactsPlugin'
    s.version = '0.0.1'
    s.summary = 'Contacts'
    s.license = 'MIT'
    s.homepage = 'https://github.com/capptivation/capacitor-plugin-contacts.git'
    s.author = ''
    s.source = { :git => 'https://github.com/capptivation/capacitor-plugin-contacts.git', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
  end