# React IndexedDB Example

```shell
npm create vite@latest react-indexeddb-example -- --template react-ts
```

To run in development mode

```shell
npm run dev
```

## Progressive Web Application

A Progressive Web Application allows a web application to function offline. It largely comprises a manifest and a service worker that allows it to cache static resources to function offline.

This is implemented using [Vite PWA](https://github.com/vite-pwa/vite-plugin-pwa) which uses [Workbox](https://developer.chrome.com/docs/workbox/).

```shell
npm i vite-plugin-pwa -D
```

To test the offline mode, build the application and run in preview mode.

```shell
npm run build
npm run preview
```

It is possible to switch Edge to offline mode using Developer Tools. In `Network` toggle `No throttling` to `Offline`.

Installed apps can be seen in `edge://apps`.

## IndexedDB

IndexedDB can be used to store large amounts of data on the client subject to a quota. In comparison `Local Storage` is limited to [5 MiB per origin](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).

The quota can be determined using

```javascript
navigator.storage.estimate();
```

It can also be seen in Developer Tools in the `Application` tab under `Storage`.

Note that IndexedDB storage is considered site data and policies affecting this is typically grouped as `Cookies and other site data`.

The following are site data

* Local and session storage
* IndexedDB
* Web SQL (Deprecated)
* Cookies
* Cache storage
* Origin Private File System (File System API)

## File System Access API

The [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access) enables browser applications to access the file system outside the sandbox environment. This API has limited adoption and is largely [limited](https://caniuse.com/native-filesystem-api) to desktop Chromium browsers.

This API requires user interaction for permission but it is possible to acquire persistent permission. This however requires the user to know how to use the system. These permissions can be revoked by the user at any time.

The application can prompt the user to select a directory using a directory picker which can only start in predefined directories, defaulting to the `Documents` directory if not specified. The browser can choose not to let the user pick a particular directory with a `can't open the folder because it contains system files` message. After a directory is selected the user is asked `Let site edit files?`. It is not possible to ask at this time for persistent permission. When the browser is closed and reopened, the application can then prompt `View and edit files for the last time you visited this site` with 3 options, `Allow this time`, `Allow on every visit` and `Don't allow`. It is possible for the user to modify all these settings by clicking on the icon next to the browser address bar.

Permissions can be controlled using the following policies

* [`DefaultFileSystemReadGuardSetting`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#defaultfilesystemreadguardsetting)
* [`DefaultFileSystemWriteGuardSetting`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#defaultfilesystemwriteguardsetting)
* [`FileSystemReadAskForUrls`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#filesystemreadaskforurls)
* [`FileSystemReadBlockedForUrls`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#filesystemreadaskforurls)
* [`FileSystemWriteAskForUrls`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#filesystemwriteaskforurls)
* [`FileSystemWriteBlockedForUrls`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#filesystemwriteblockedforurls)

## Microsoft Edge Policy

Microsoft Edge can be configured via [policies](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies). When configured clicking on the `three dots icon` for `Settings and more` will display `Managed by your organization` with a briefcase icon.

The policies can be easily viewed by going to `edge://policy`.

Guidance can be taken from
* CIS Microsoft Edge v3.0.0 [L1](https://www.tenable.com/audits/CIS_Microsoft_Edge_v3.0.0_L1) [L2](https://www.tenable.com/audits/CIS_Microsoft_Edge_v3.0.0_L2)
* DISA STIG Edge [v2r2](https://www.tenable.com/audits/DISA_STIG_Microsoft_Edge_v2r2)
* MSCT Edge [v131 v1.0.0](https://www.tenable.com/audits/MSCT_Microsoft_Edge_Version_131_v1.0.0)

This can be configured via [Mobile Device Management](https://learn.microsoft.com/en-us/deployedge/configure-edge-with-mdm) or Group Policy Objects (GPOs).

Configuring requires the Microsoft Edge Administration Template (`MSEdge.admx`). These can be found in the [STIG Group Policy Objects](https://public.cyber.mil/stigs/gpo/).

The GPOs for MSCT and DISA STIG are freely available but the GPOs for CIS are found in their [CIS Build Kits](https://www.cisecurity.org/cis-securesuite/cis-securesuite-build-kit-content/build-kits-faq) which requires membership.

### Prevent user from manually clearing site data

There is no in-built policy to prevent the user from manually clearing the site data. If the user chooses to do so, site data such as IndexedDB will be cleared.

One possible workaround is to disable the `Settings` page completely using the [`URLBlocklist`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#urlblocklist) policy.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\URLBlocklist]
"1"="edge://settings"
```

### Prevent browser from automatically clearing site data

Microsoft Edge automatically clears the site data for the following reasons

* Due to storage pressure
* Due to `Privacy, search and services` settings to automatically `Delete browsing data` when configuring `Choose what to clear every time you close the browser`

#### Storage Pressure

There is no policy to disable automatic clearing of site data due to storage pressure. This can only be done using the `Storage API` with a call to [`navigator.storage.persist()`](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist).

Note that Microsoft Edge does not prompt the user to ask for permission to persist and uses a heuristic to automatically determine if it will grant permission to persist.

In practice the following conditions must be true, as the other conditions can be difficult to satisfy

* The application must be a Progressive Web Application and must be installed
* The application must be in a secure HTTPS context. (There is no exception for `localhost`, it must be `https://localhost` and not `http://localhost`)

```javascript
if (navigator.storage && navigator.storage.persist) {
  const persisted = await navigator.storage.persist();
  console.log(`Persisted storage granted: ${persisted}`);
}
```

#### Privacy Settings

By default Microsoft Edge does not clear cookies and other site data on exit.

Note that the Microsoft Edge Security Technical Implementation Guide recommends that [Session only-based cookies must be enabled](https://stigviewer.com/stigs/microsoft_edge/2024-09-13/finding/V-260467). This sets the `DefaultCookiesSetting` policy to `4` which will clear cookies and other site data on exit. This was also previously recommended in [`CIS Google Chrome L2 v2.1.0`](https://www.tenable.com/audits/items/CIS_Google_Chrome_L2_v2.1.0.audit:28091ca4e07b20dbe8cdad39b5626de7) but has since been removed in `CIS Google Chrome L2 v3.0.0`. This is also not present in either [`CIS Microsoft Edge L1 v3.0.0`](https://www.tenable.com/audits/CIS_Microsoft_Edge_v3.0.0_L1) or [`CIS Microsoft Edge L2 v3.0.0`](https://www.tenable.com/audits/CIS_Microsoft_Edge_v3.0.0_L2).

* Disabled (0, user's personal setting applies)
* Allow all sites to set local data (1)
* Do not allow any site to set local data (2)
* Keep cookies for the duration of the session (4)

Note that if the `RestoreOnStartup` setting is set to restore certain URLs, the `DefaultCookiesSetting` will not be respected.

The `SaveCookiesOnExit` policy needs to be added to ensure that the browser does not clear the site data for the application automatically.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge\SaveCookiesOnExit]
"1"="https://localhost:4173"
```

### Automatically install the Progressive Web Application

It is possible to set up a policy to automatically install a Progressive Web Application. This makes it more likely for the application's `Storage API` call to set the site data to be persistent to be successful.

This can be done using the [`WebAppInstallForceList`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#webappinstallforcelist) policy.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge]
"WebAppInstallForceList"="[{\"create_desktop_shortcut\": false, \"default_launch_container\": \"window\", \"url\": \"https://localhost:4173\"}]"
```

Installed PWAs can be found in `edge://apps`.

## Microsoft Edge Profile

The `Cookies and other site data` are stored in the user's Local profile. This is typically `C:/Users/username/AppData/Local/Microsoft/Edge/UserData/Default`. It is possible to specify a custom profile directory using the `--user-data-dir` parameter. If there is a need for the data to be shared among all the users the `Public` user could be used. Note that all users have access to the data in such a case. This is also configurable using the [`UserDataDir`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies#userdatadir) policy.

The `AppData` directory is hidden by default in Windows File Explorer, but is typically still accessible by the user.

It is possible to check the profile in use in Microsoft Edge using `edge://version`.

The IndexedDB data can typically be found in `C:/Users/username/AppData/Local/Microsoft/Edge/User Data/Default/IndexedDB` and is stored on a per origin basis, eg. `https_localhost_4173.indexeddb.leveldb`. Chromium browsers implemented IndexedDB, Local Storage and Session Storage using [LevelDB](https://github.com/google/leveldb). Data in LevelDB is not encrypted, but is typically [compressed](https://github.com/google/leveldb/blob/main/doc/index.md#compression).


## Cryptography

Both browsers and Node implement the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). On browsers this is only available in secure contexts and can be accessed by `window.crypto`. On current versions of Node it can be accessed using the global `crypto` variable. Access to most functionality is by accessing the `crypto.subtle` member. These are implementations of the [Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) and [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) interface.

Note that there is [no access](https://www.w3.org/TR/WebCryptoAPI/#scope-out-of-scope) to the operating system key or trust stores, nor access to smart cards.

It is likely not possible to achieve non-repudiation for a web application. By its nature a web application is run with a javascript engine and it is possible via cross-site script injection to run malicious code that may either misrepresent the intent to the user to perform signing, or automatically sign data without the user knowing.

In the face of a cross-site script, it is only possible to make it such that the attacker cannot steal the key, but cannot prevent its use while the cross-site script is running. This can be done by generating a non-extractable key and storing the CryptoKey handle in IndexedDB. Note that this key will be cleared along with other site data. Also note that the specification places [no requirements](https://www.w3.org/TR/WebCryptoAPI/#security-developers) on how the underlying cryptographic key material is stored. In particular, it does not guarantee that the underlying cryptographic key material will not be persisted to disk, possibly unencrypted, nor that it will be inaccessible to users or other applications running with the same privileges as the User Agent.

## Kiosk

Both [Microsoft Windows](https://learn.microsoft.com/en-us/windows/configuration/kiosk/) and [Microsoft Edge](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-configure-kiosk-mode) have a kiosk mode. Note that Microsoft Edge's kiosk mode is not suitable for Progressive Web Applications that needs to persist data as it operates in [InPrivate](https://support.microsoft.com/en-us/microsoft-edge/browse-inprivate-in-microsoft-edge-cd2c9a48-0bc4-b98e-5e46-ac40c84e27e2) browsing mode.

Microsoft Windows offers two kiosk modes

* Single-app kiosk
* Restricted user experience (Multi-app kiosk)

Microsoft Edge offers two kiosk modes

* Digital/Interactive Signage experience: Displays a specific site in full-screen mode
* Public-Browsing experience: Runs a limited multi-tab version of Microsoft Edge

Both run in a Microsoft Edge InPrivate session.

### Multi-app kiosk with Assigned Access

When Assigned Access is applied on a device it will apply certain [Assigned Access policy settings](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/policy-settings) using a combination of configuration service provider (CSP) and group policy (GPO) settings.

This can be configured using

* [Intune / Policy Configuration Service Providers (CSPs)](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/configure-multi-app-kiosk?tabs=intune)
* [Provisioning Package](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/configure-multi-app-kiosk?tabs=ppkg) created using Windows Configuration Designer
* [Powershell](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/configure-multi-app-kiosk?tabs=ps)

Configuration examples

* [Assigned Access XML examples](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/examples?pivots=windows-11)
* [Quickstart: Configure a multi-app kiosk](https://learn.microsoft.com/en-us/windows/configuration/assigned-access/quickstart-restricted-user-experience?tabs=ps&pivots=windows-11)

#### Powershell

It is recommended that a virtual machine is used for testing as the Kiosk functionality will activate [AppLocker](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/applocker/applocker-overview).

The [PsExec](https://learn.microsoft.com/en-us/sysinternals/downloads/psexec) tool is used as the command requires the use of the `SYSTEM` account. 

* Download the psexec tool
* Open an elevated prompt and run `psexec.exe -i -s powershell.exe`
* Run script

```powershell
$assignedAccessConfiguration = @"

# content of the XML configuration file

"@

$namespaceName="root\cimv2\mdm\dmmap"
$className="MDM_AssignedAccess"
$obj = Get-CimInstance -Namespace $namespaceName -ClassName $className
$obj.Configuration = [System.Net.WebUtility]::HtmlEncode($assignedAccessConfiguration)
$obj = Set-CimInstance -CimInstance $obj -ErrorVariable cimSetError -ErrorAction SilentlyContinue
if($cimSetError) {
    Write-Output "An ERROR occurred. Displaying error record and attempting to retrieve error logs...`n"
    Write-Error -ErrorRecord $cimSetError[0]

    $timeout = New-TimeSpan -Seconds 30
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    do{
        $events = Get-WinEvent -FilterHashtable $eventLogFilterHashTable -ErrorAction Ignore
    } until ($events.Count -or $stopwatch.Elapsed -gt $timeout) # wait for the log to be available

    if($events.Count) {
        $events | ForEach-Object {
            Write-Output "$($_.TimeCreated) [$($_.LevelDisplayName.ToUpper())] $($_.Message -replace "`n|`r")"
        }
    } else {
        Write-Warning "Timed-out attempting to retrieve event logs..."
    }

    Exit 1
}

Write-Output "Successfully applied Assigned Access configuration"
```

The following is a sample configuration

```xml
<?xml version="1.0" encoding="utf-8"?>
<AssignedAccessConfiguration xmlns="http://schemas.microsoft.com/AssignedAccess/2017/config" xmlns:rs5="http://schemas.microsoft.com/AssignedAccess/201810/config" xmlns:v3="http://schemas.microsoft.com/AssignedAccess/2020/config" xmlns:v5="http://schemas.microsoft.com/AssignedAccess/2022/config">
  <Profiles>
    <Profile Id="{9A2A490F-10F6-4764-974A-43B19E722C23}">
      <AllAppsList>
        <AllowedApps>
          <App AppUserModelId="Microsoft.WindowsCalculator_8wekyb3d8bbwe!App" />
          <App AppUserModelId="Microsoft.Windows.Photos_8wekyb3d8bbwe!App" />
          <App AppUserModelId="Microsoft.BingWeather_8wekyb3d8bbwe!App" />
          <App DesktopAppPath="%windir%\System32\cmd.exe" />
          <App DesktopAppPath="%windir%\System32\WindowsPowerShell\v1.0\Powershell.exe" />
          <App DesktopAppPath="%windir%\explorer.exe" />
          <App AppUserModelId="windows.immersivecontrolpanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel" />
          <App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" />
        </AllowedApps>
      </AllAppsList>
      <rs5:FileExplorerNamespaceRestrictions>
        <rs5:AllowedNamespace Name="Downloads" />
        <v3:AllowRemovableDrives />
      </rs5:FileExplorerNamespaceRestrictions>
      <v5:StartPins><![CDATA[{
                    "pinnedList":[
                        {"packagedAppId":"Microsoft.WindowsCalculator_8wekyb3d8bbwe!App"},
                        {"packagedAppId":"Microsoft.Windows.Photos_8wekyb3d8bbwe!App"},
                        {"packagedAppId":"Microsoft.BingWeather_8wekyb3d8bbwe!App"},
                        {"desktopAppLink":"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\System Tools\\Command Prompt.lnk"},
                        {"desktopAppLink":"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Windows PowerShell\\Windows PowerShell.lnk"},
                        {"desktopAppLink":"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\File Explorer.lnk"},
                        {"packagedAppId": "windows.immersivecontrolpanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel"},
                        {"desktopAppLink": "%ALLUSERSPROFILE%\\Microsoft\\Windows\\Start Menu\\Programs\\Microsoft Edge.lnk"}
                    ]
                }]]></v5:StartPins>
      <Taskbar ShowTaskbar="true" />
    </Profile>
  </Profiles>
  <Configs>
    <Config>
      <AutoLogonAccount rs5:DisplayName="MS Learn Example" />
      <DefaultProfile Id="{9A2A490F-10F6-4764-974A-43B19E722C23}" />
    </Config>
  </Configs>
</AssignedAccessConfiguration>
```

The configuration can be removed using the following script.

```powershell
$namespaceName="root\cimv2\mdm\dmmap"
$className="MDM_AssignedAccess"
$obj = Get-CimInstance -Namespace $namespaceName -ClassName $className
$obj.Configuration = $null
Set-CimInstance -CimInstance $obj
```

The following needs to be in the allowed apps list to pin elements with [Microsoft Edge secondary tiles](https://learn.microsoft.com/en-us/windows-hardware/customize/desktop/customize-the-windows-11-start-menu#example-web-pin)

* `<App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge_proxy.exe" />`
* `<App AppUserModelId="Microsoft.MicrosoftEdge.Stable_8wekyb3d8bbwe!App"/>`

The following needs to be in the allowed apps list to explicitly run as a PWA.

* `<App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge_proxy.exe" />`
* `<App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\pwahelper.exe" />`
* `<App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\134.0.3124.93\elevation_service.exe" />`

Alternatively the URL to the PWA can be launched using the `--app` switch.

The `smallIcon` and `largeIcon` are a Base64 encoded PNGs

The following are [recommended sizes](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/icon-theme-color#icon-image-sizes)

* App Icon: 44x44
* Medium Tile: 150x150

The [Get-StartApps](https://learn.microsoft.com/en-us/powershell/module/startlayout/get-startapps?view=windowsserver2025-ps) cmdlet can be used to get the AppIDs.

```powershell
Get-StartApps
```

## Windows Group Policy

Windows applies Group Policy Objects in the following order where the last writer wins

* Local Group Policy
* Administrators Local Group Policy (OR) Non-Administrators Local Group Policy
* Local User Policy
* Domain Group Policy

Note that in addition to Group Policy Objects (GPOs). Policies can also be configured with Configuration Service Providers (CSPs). The [ControlPolicyConflict](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-controlpolicyconflict) CSP can be used in this case to control precedence.

GPOs can be applied locally using the [`LGPO`](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/security-compliance-toolkit-10#what-is-the-local-group-policy-object-lgpo-tool) tool found in the [Microsoft Security Compliance Toolkit](https://www.microsoft.com/en-us/download/details.aspx?id=55319).

It is recommended that the [Windows Sandbox](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/) is used when creating and testing GPOs.
