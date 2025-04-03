$assignedAccessConfiguration = @"
<?xml version="1.0" encoding="utf-8"?>
<AssignedAccessConfiguration xmlns="http://schemas.microsoft.com/AssignedAccess/2017/config" xmlns:rs5="http://schemas.microsoft.com/AssignedAccess/201810/config" xmlns:v3="http://schemas.microsoft.com/AssignedAccess/2020/config" xmlns:v5="http://schemas.microsoft.com/AssignedAccess/2022/config">
  <Profiles>
    <Profile Id="{9A2A490F-10F6-4764-974A-43B19E722C23}">
      <AllAppsList>
        <AllowedApps>
          <App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" rs5:AutoLaunch="true" rs5:AutoLaunchArguments="  --app=https://localhost:4173/index.html --user-data-dir=&quot;C:/Users/Public/AppData/Local/Microsoft/Edge/User Data&quot; --start-maximized" />
          <App DesktopAppPath="%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge_proxy.exe" />
          <App AppUserModelId="Microsoft.MicrosoftEdge.Stable_8wekyb3d8bbwe!App"/>
          <App DesktopAppPath="%windir%\explorer.exe" />
        </AllowedApps>
      </AllAppsList>
      <rs5:FileExplorerNamespaceRestrictions>
        <rs5:AllowedNamespace Name="Downloads" />
      </rs5:FileExplorerNamespaceRestrictions>
      <v5:StartPins><![CDATA[{
                    "pinnedList":[
                        {"desktopAppLink":"%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\File Explorer.lnk"},
                        {"desktopAppLink":"C:\\Users\\Public\\Start Menu\\Programs\\Microsoft Edge.lnk"},
                        {"secondaryTile": { "tileId": "MSEdge._pin_mbfkklhhpckngkihcgoamfamci", "arguments": " --app=https://localhost:4173/index.html --user-data-dir=\"C:/Users/Public/AppData/Local/Microsoft/Edge/User Data\" --launch-tile --start-maximized", "displayName": "Vite", "packagedAppId": "Microsoft.MicrosoftEdge.Stable_8wekyb3d8bbwe!App", "smallIconPath": "ms-appdata:///local/Pins/MSEdge._pin_mbfkklhhpckngkihcgoamfamci/SmallLogo.png", "smallIcon": "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", "largeIconPath": "ms-appdata:///local/Pins/MSEdge._pin_mbfkklhhpckngkihcgoamfamci/Logo.png" }}
                    ]
                }]]></v5:StartPins>
      <Taskbar ShowTaskbar="true" />
    </Profile>
  </Profiles>
  <Configs>
    <Config>
      <Account>Kiosk</Account>
      <DefaultProfile Id="{9A2A490F-10F6-4764-974A-43B19E722C23}" />
    </Config>
    <Config>
      <Account>Kiosk2</Account>
      <DefaultProfile Id="{9A2A490F-10F6-4764-974A-43B19E722C23}" />
    </Config>    
  </Configs>
</AssignedAccessConfiguration>
"@

$namespaceName="root\cimv2\mdm\dmmap"
$className="MDM_AssignedAccess"
$obj = Get-CimInstance -Namespace $namespaceName -ClassName $className
$obj.Configuration = [System.Net.WebUtility]::HtmlEncode($assignedAccessConfiguration)
Set-CimInstance -CimInstance $obj