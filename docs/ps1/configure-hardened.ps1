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
        </AllowedApps>
      </AllAppsList>
      <rs5:FileExplorerNamespaceRestrictions>
        <rs5:AllowedNamespace Name="Downloads" />
      </rs5:FileExplorerNamespaceRestrictions>
      <v5:StartPins><![CDATA[{
                    "pinnedList":[
                        {"secondaryTile": { "tileId": "MSEdge._pin_mbfkklhhpckngkihcgoamfamci", "arguments": " --app=https://localhost:4173/index.html --user-data-dir=\"C:/Users/Public/AppData/Local/Microsoft/Edge/User Data\" --launch-tile --start-maximized", "displayName": "Vite", "packagedAppId": "Microsoft.MicrosoftEdge.Stable_8wekyb3d8bbwe!App", "smallIconPath": "ms-appdata:///local/Pins/MSEdge._pin_mbfkklhhpckngkihcgoamfamci/SmallLogo.png", "smallIcon": "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAQlBMVEVMaXE0hJo0g5r32Us9PT00hJo0hJk3Z3Q0g5o8PDz32Uv32Uv32Uo9PT09PT322Er32Ur32Uo2dYY1hJo+Pj732UslCnuXAAAAE3RSTlMAum+t5ppPGes+Uo/OqVwl7Hi7Oe48CgAAAAlwSFlzAAAD6AAAA+gBtXtSawAAAWxJREFUeNrtltuWgyAMRREvoHhd2P//1QECISilq+PbDOehqymySU4Ay1hVVVXVf9f2FHA8TaBN47FDLasgA700wojbSNrx9go4ibo1DkhtNCRRYxN4lQDniYTBztB9Elnc8QGwYAVuSqihwWDOA8ZxXDv3JclZa3BFYDrTKw9wzxlCl1agNSfpOAtLgOVWAfjGBLHwA8B4KGgFsCwnFhYAwpRgn+akAqhBooW7Aeyz1ZY10VbQyFBB7xMfqIVebb6NqzOcw5rSf0IPg4VeUx4gXL0S1uwhj0FoaiFoz2+kxW8ZDjM9p0cLFQKOK8CdpWX0W0b63GMQLQRt2TYy7FgwrUmakbPwBohThgQn3DG4W/geIOMZCBtysrKNmNl7gKAVRB7eC87IowDAQzBQS+LNZAE7KwHg4IQpgp7JAFBFgF+0Sa4FkQAu97owuvxQupRVauH3UkkPfwPYH75XlHoKePpqnOq/i6qqv6gfYi8vW8lOnQQAAAAASUVORK5CYII=", "largeIconPath": "ms-appdata:///local/Pins/MSEdge._pin_mbfkklhhpckngkihcgoamfamci/Logo.png", "largeIcon": "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAMFBMVEVMaXE4X2o0hJo0hJn32Us9PT342Eo0hJk9PT332Eo9PT332Er32Uo1hJo+Pj732UtqwtM8AAAADXRSTlMALmSlesUr2nPa5a/urH+4RgAAAAlwSFlzAAAD6AAAA+gBtXtSawAAA/VJREFUeNrtnOGSmyAUhblgxGhM3v9tm2bbWQUuHhSmZed8P7duxg/OQUiyNYYQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEFKBcexcYOld4NG5wPDqXODeucD46lxg6VzgPQFFArdnjvk2TYK9kKxbsr/k1oB9hWsKfLhNyAvt78rCqm/cvsLVBd4TASh4/Z6OJkCCBNUXeM+CFCVon4qA8P59UOEmAs9ZShKUy5BdM5d+JqCJwPMpBQnKZcgfVbiVQNYgKuYKT8BO9dFSIJeiqJjqQpqt8NcEtBJ43vAEqRmS4wr/C4E4Qfsby0xAXOF2AlNBgrQMrccVbicgBQlSFlKkwtcEJiNfTLf5SoKUDHmgwtcEti84zWCCbEpgRS704TaoqoCR+XyCkhmCKlxRwMj5BKUW0vzjbmkgsP3n0gQlMuSgClcVmM4nKJGhFapwVQE5n6A4Q/bwJFNfwMznExQtpB6rcCOB8gSFD2OLbIOaCczlCQpLkK3wdgKqCiQSZMEEBUMsaIXblHjz8yAZeoL2t+jQCjd5DszbEXf5tVHJ0IpW+PW6BwzXn8TTbiQFS9BukPEKx4zX90KyG0mnJsN77WHs8QkIuV/fjc7BSIqWDGeVu7R4hSOGovOA/D0PbDfTUzDiTkuGiJIhdBuU4FHhRBaNuCgJiqKirqG2zgSA741GXXRKgqKhFmUCvLqGFlUYFJjizko6QdFYu+I1NGSpcKhPdNYpCQoz5IEKLxcSBAnMqdVc0glKZ8i3qjAmcEut+i6doOhntuUaCgpMyVVf0glKzUq7CmMC6f2ASycout2jNfRShbHPyJR9gyQTlMiQA9+MODMBiMCk7Bt8PNbpDOUPy+e3QaDArO4oLbZtaFnhvMB8Cz4mdiu0+c/usOtW+PhICZ9dNsGWA4GKFS4TyI+sw06ZdStcJuDQcYVNr5xkTgjA45rPUM0KFwng45rNkK+2DSoVgBOUvxQ/ySyVBTzczGyGqla43gw4VHZ34RCwlFa4SEDgBOVkJf+FxcIK13sOnH3LXReAKlz4JPZogvQl18ICQwMBu8L35dDPzVSBsYGAHm3U1cECi2khICt8XycqfOqDvjIBbQoseKU3qABY4WIBpcdoXywsMLQSsGiypbzCW4GxlQD+zRpfXOGNAFrhEwKCDqwtrvCpL9wUCyTa6UBTb1CBu2koIGg1fWmFvwUGXGAKAH7Fut/Yb7TrQgwq8DCm2z+fKazwfyowdi5wN50LDJ0L9FvhPwJD7wJj5wKL6Vxg6Fyg5wp/BIbeBcbOBbqu8A/4W+jhbjoXGHoX6P3/M+j9/gkhhBBCCCGEEEIIIYQQQgghhBBCyI/jFxRPL1pgKbG+AAAAAElFTkSuQmCC" }}
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
      <Account>Kiosk 2</Account>
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